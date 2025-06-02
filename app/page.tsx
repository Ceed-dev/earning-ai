"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check, Twitter } from "lucide-react";
import Link from "next/link";

export default function AgentRegistration() {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setShowModal(true);
  };

  const handleOAuthApprove = async () => {
    setIsConnecting(true);
    // Simulate OAuth process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              AI Agent 登録
            </CardTitle>
            <p className="text-gray-600 mt-2">
              AIエージェントをプラットフォームに紐付けます
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Twitter className="w-6 h-6 text-blue-500" />
                <span className="font-medium">X アカウント連携</span>
              </div>
              <motion.div
                key={isConnected ? "connected" : "disconnected"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {isConnected ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <X className="w-6 h-6 text-red-500" />
                )}
              </motion.div>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isConnected}
              className="w-full"
              variant={isConnected ? "outline" : "default"}
            >
              {isConnected ? "連携済み" : "X アカウントを連携"}
            </Button>

            <Link href="/campaign">
              <Button
                disabled={!isConnected}
                className="w-full"
                variant="secondary"
              >
                次へ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* OAuth Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center">
                <Twitter className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">X アカウント連携</h3>
                <p className="text-gray-600 mb-6">
                  AIエージェントがあなたのXアカウントにアクセスすることを許可しますか？
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleOAuthApprove}
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? "連携中..." : "許可する"}
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="w-full"
                    disabled={isConnecting}
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
