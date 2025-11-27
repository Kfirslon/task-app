"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { RouteGuard } from "@/components/RouteGuard";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} min-h-screen relative`}>
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900" />
        
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 2px, transparent 2px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
        
        <div className="fixed top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="fixed bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div
          className="fixed inset-0 -z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
            height: '200px',
            animation: 'scan 8s linear infinite'
          }}
        />
        
        <style jsx global>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(100px); }
          }
          @keyframes scan {
            0% { transform: translateY(-200px); }
            100% { transform: translateY(100vh); }
          }
        `}</style>
        
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
            <Card className="w-full shadow-2xl border-2 border-purple-500/30 backdrop-blur-sm bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <RouteGuard>{children}</RouteGuard>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
