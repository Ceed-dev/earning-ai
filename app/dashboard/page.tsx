"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  DollarSign,
  Target,
  Bot,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";

interface AgentCandidate {
  id: string;
  name: string;
  predictedBid: number;
  performance: {
    ctr: number;
    conversions: number;
    roi: number;
  };
  approved: boolean;
}

export default function Dashboard() {
  const [bidData, setBidData] = useState<Array<{ time: string; bids: number }>>(
    [],
  );
  const [budgetUsed, setBudgetUsed] = useState(0);
  const [status, setStatus] = useState<"未承認" | "入札中" | "配信中">(
    "未承認",
  );
  const [currentBids, setCurrentBids] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [budget] = useState(500000); // 50万円
  const [budgetRemaining, setBudgetRemaining] = useState(500000);

  const [agentCandidates, setAgentCandidates] = useState<AgentCandidate[]>([
    {
      id: "agent-a",
      name: "AIエージェント A",
      predictedBid: 120,
      performance: { ctr: 2.4, conversions: 156, roi: 340 },
      approved: false,
    },
    {
      id: "agent-b",
      name: "AIエージェント B",
      predictedBid: 95,
      performance: { ctr: 1.8, conversions: 203, roi: 280 },
      approved: false,
    },
    {
      id: "agent-c",
      name: "AIエージェント C",
      predictedBid: 150,
      performance: { ctr: 3.1, conversions: 89, roi: 420 },
      approved: false,
    },
  ]);

  const isBudgetInsufficient = budgetRemaining < 100000; // 10万円未満で警告

  const handleApproveAgent = (agentId: string) => {
    setAgentCandidates((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, approved: true }
          : { ...agent, approved: false },
      ),
    );
    setSelectedAgent(agentId);
    setStatus("入札中");

    // Start bidding simulation after approval
    setTimeout(() => {
      setStatus("配信中");
    }, 4000);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "入札中" || status === "配信中") {
      // Initialize with some data points if empty
      if (bidData.length === 0) {
        const initialData = [];
        const now = Date.now();
        for (let i = 0; i < 8; i++) {
          const time = new Date(now - (7 - i) * 2000);
          initialData.push({
            time: time.toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            bids: Math.floor(Math.random() * 40) + 20,
          });
        }
        setBidData(initialData);
      }

      // Simulate real-time bid data
      interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setBidData((prev) => {
          const newBids = Math.floor(Math.random() * 50) + 20;
          const newData = [
            ...prev,
            {
              time: timeStr,
              bids: newBids,
            },
          ].slice(-12); // Keep last 12 data points
          return newData;
        });

        setCurrentBids((prev) => prev + Math.floor(Math.random() * 15) + 5);
        setBudgetUsed((prev) => {
          const newUsed = Math.min(prev + Math.random() * 1.5, 85);
          setBudgetRemaining(budget * (1 - newUsed / 100));
          return newUsed;
        });
      }, 2000); // Update every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, budget, bidData.length]);

  const getStatusColor = (currentStatus: typeof status) => {
    switch (currentStatus) {
      case "未承認":
        return "text-gray-500";
      case "入札中":
        return "text-blue-600";
      case "配信中":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBgColor = (currentStatus: typeof status) => {
    switch (currentStatus) {
      case "未承認":
        return "bg-gray-100";
      case "入札中":
        return "bg-blue-100";
      case "配信中":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            AI エージェント ダッシュボード
          </h1>
          <p className="text-center text-gray-600">
            AIエージェント候補の承認と配信状況の監視
          </p>
        </motion.div>

        {/* Agent Candidates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                配信Agent候補リスト
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentCandidates.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`p-4 border rounded-lg transition-all duration-300 ${
                      agent.approved
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Bot className="w-6 h-6 text-blue-500" />
                          <h3 className="font-semibold text-lg">
                            {agent.name}
                          </h3>
                          {agent.approved && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700"
                            >
                              承認済み
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">予測入札:</span>
                            <span className="font-semibold">
                              ¥{agent.predictedBid}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">CTR:</span>
                            <span className="font-semibold">
                              {agent.performance.ctr}%
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">CV:</span>
                            <span className="font-semibold">
                              {agent.performance.conversions}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-600">ROI:</span>
                            <span className="font-semibold">
                              {agent.performance.roi}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => handleApproveAgent(agent.id)}
                          disabled={agent.approved || isBudgetInsufficient}
                          variant={agent.approved ? "secondary" : "default"}
                          className={
                            agent.approved ? "bg-green-100 text-green-700" : ""
                          }
                        >
                          {agent.approved ? "承認済み" : "OK"}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}

                {/* Budget Warning */}
                <AnimatePresence>
                  {isBudgetInsufficient && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">
                        予算残高不足：追加設定をお願いします
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status and Metrics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  配信ステータス
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  key={status}
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`text-2xl font-bold ${getStatusColor(status)}`}
                >
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusBgColor(status)}`}
                  >
                    {status === "配信中" && (
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                    )}
                    {status}
                  </div>
                </motion.div>
                <p className="text-xs text-muted-foreground mt-2">
                  {status === "未承認" && "エージェントを選択してください"}
                  {status === "入札中" && "AIエージェントが自動入札中"}
                  {status === "配信中" && "AIエージェントが自動で最適化中"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  予算使用率
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {budgetUsed.toFixed(1)}%
                </div>
                <Progress value={budgetUsed} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  残り: ¥{budgetRemaining.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bids Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総入札数</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  key={currentBids}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className={`text-2xl font-bold ${status === "未承認" ? "text-gray-400" : "text-purple-600"}`}
                >
                  {status === "未承認" ? "---" : currentBids.toLocaleString()}
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  {status === "未承認" ? "承認後に開始" : "リアルタイム更新中"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Real-time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                リアルタイム入札数
                {status === "未承認" && (
                  <Badge variant="outline" className="text-gray-500">
                    承認待ち
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {status === "未承認" ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        エージェント承認後にグラフが表示されます
                      </p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={bidData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        interval={0}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#666"
                        domain={[0, 80]}
                      />
                      <Line
                        type="monotone"
                        dataKey="bids"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                        activeDot={{
                          r: 7,
                          stroke: "#8b5cf6",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Agent Info */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                <Bot className="w-4 h-4" />
                <span className="font-medium">
                  {agentCandidates.find((a) => a.id === selectedAgent)?.name}{" "}
                  が配信を実行中
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
