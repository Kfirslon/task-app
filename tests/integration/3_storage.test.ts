import {
  TestUser,
  getOrCreateTestUser,
  cleanupTestUser,
  createTask,
  getAuthenticatedClient,
} from "../test-utils/user-testing-utils";
import fs from "fs/promises";
import path from "path";

const TEST_USER_DAVID = {
  name: "David (Test User)",
  email: "test-user.david@pixegami.io",
  password: "Test123!@#David",
};

const TEST_USER_DOMINIC = {
  name: "Dominic (Test User)",
  email: "test-user.dominic@pixegami.io",
  password: "Test123!@#Dominic",
};

describe("Suite 3: Storage (Task Image Attachments)", () => {

  let testUserDavid: TestUser;
  let testUserDominic: TestUser;

  beforeAll(async () => {
    testUserDavid = await getOrCreateTestUser(TEST_USER_DAVID);
    testUserDominic = await getOrCreateTestUser(TEST_USER_DOMINIC);
  }, 15_000);

  afterAll(async () => {
    if (testUserDavid) {
      await cleanupTestUser(testUserDavid.id);
    }
    if (testUserDominic) {
      await cleanupTestUser(testUserDominic.id);
    }
  }, 15_000);

  async function uploadTaskImage(testUser: TestUser, taskId: string) {
    const imagePath = "./tests/data/test_image.png";
    const fileBuffer = await fs.readFile(imagePath);
    const fileName = path.basename(imagePath);
    const fileType = fileName.split(".").pop()?.toLowerCase();
    const mimeType = `image/${fileType}`;
    const storagePath = `${testUser.id}/${taskId}.png`;

    // Get authenticated client for the user
    const userClient = await getAuthenticatedClient(testUser);

    const { error: uploadError } = await userClient.storage
      .from("task-attachments")
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    return { storagePath, uploadError, userClient };
  }

  test("can attach image to a task", async () => {
    const { data: taskData } = await createTask(
      testUserDavid,
      "Test Task with Image"
    );
    const task = taskData![0];
    expect(task).toBeTruthy();

    const { storagePath, uploadError, userClient } = await uploadTaskImage(
      testUserDavid,
      task.task_id
    );
    expect(uploadError).toBeFalsy();

    const { error: updateError } = await userClient
      .from("tasks")
      .update({ image_url: storagePath })
      .eq("task_id", task.task_id);
    expect(updateError).toBeFalsy();

    // Verify the task was updated with the image
    const { data: updatedTask } = await userClient
      .from("tasks")
      .select()
      .eq("task_id", task.task_id)
      .single();

    expect(updatedTask.image_url).toContain(storagePath);
    console.log("Task updated with image: " + updatedTask.image_url);

    // Check that the image exists
    const { data: readImage } = await userClient.storage
      .from("task-attachments")
      .exists(storagePath);
    expect(readImage).toBeTruthy();

    // Delete the task and verify the image is deleted.
    const { error: deleteError } = await userClient
      .from("tasks")
      .delete()
      .eq("task_id", task.task_id);
    expect(deleteError).toBeFalsy();

    // Check that the image is deleted.
    const { data: deletedImage } = await userClient.storage
      .from("task-attachments")
      .exists(storagePath);
    expect(deletedImage).toBeFalsy();
    console.log("Task deleted and image deleted: " + task.task_id);
  });

  test("cannot attach image to other user's task", async () => {
    // Create a task as David
    const { data: taskData } = await createTask(
      testUserDavid,
      "Test Task for Image Security"
    );
    const task = taskData![0];
    expect(task).toBeTruthy();

    // Try to upload as Dominic (wrong user) to David's path
    const imagePath = "./tests/data/test_image.png";
    const fileBuffer = await fs.readFile(imagePath);
    const fileName = path.basename(imagePath);
    const fileType = fileName.split(".").pop()?.toLowerCase();
    const mimeType = `image/${fileType}`;
    
    // THIS IS THE KEY: Use David's ID in the path, but authenticate as Dominic
    const storagePath = `${testUserDavid.id}/${task.task_id}.png`;

    // Get authenticated client for DOMINIC (not David)
    const dominicClient = await getAuthenticatedClient(testUserDominic);

    const { error: uploadError } = await dominicClient.storage
      .from("task-attachments")
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    // Should fail due to storage permissions
    expect(uploadError).toBeTruthy();
    console.log("Upload to another user's task path was blocked");
  });
});
