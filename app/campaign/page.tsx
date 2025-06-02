"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

export default function CampaignSetup() {
  const [budget, setBudget] = useState([50]);
  const [adCopy, setAdCopy] = useState("");
  const [targeting, setTargeting] = useState({
    tokyo: false,
    osaka: false,
    tech: false,
    business: false,
  });
  const [error, setError] = useState("");
  const [balance] = useState(1000000); // 100万円

  const handleTargetingChange = (key: string, checked: boolean) => {
    setTargeting((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = () => {
    setError("");

    const hasTargeting = Object.values(targeting).some(Boolean);
    if (!hasTargeting || !adCopy.trim()) {
      setError("ターゲティング条件と広告文を設定してください");
      return;
    }

    if (budget[0] * 10000 > balance) {
      setError("予算が残高を超えています");
      return;
    }

    // Success - navigate to dashboard
    window.location.href = "/dashboard";
  };

  const isFormValid = Object.values(targeting).some(Boolean) && adCopy.trim();
  const isBudgetExceeded = budget[0] * 10000 > balance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            キャンペーン設定
          </h1>
          <p className="text-center text-gray-600">
            ターゲティング条件・予算・クリエイティブを設定します
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Targeting */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    ターゲティング
                  </Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tokyo"
                          checked={targeting.tokyo}
                          onCheckedChange={(checked) =>
                            handleTargetingChange("tokyo", checked as boolean)
                          }
                        />
                        <Label htmlFor="tokyo">東京</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="osaka"
                          checked={targeting.osaka}
                          onCheckedChange={(checked) =>
                            handleTargetingChange("osaka", checked as boolean)
                          }
                        />
                        <Label htmlFor="osaka">大阪</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tech"
                          checked={targeting.tech}
                          onCheckedChange={(checked) =>
                            handleTargetingChange("tech", checked as boolean)
                          }
                        />
                        <Label htmlFor="tech">テクノロジー</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="business"
                          checked={targeting.business}
                          onCheckedChange={(checked) =>
                            handleTargetingChange(
                              "business",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor="business">ビジネス</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    予算設定
                  </Label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>日予算</span>
                        <motion.span
                          key={budget[0]}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                          className={`font-bold ${isBudgetExceeded ? "text-red-500" : "text-blue-600"}`}
                        >
                          ¥{(budget[0] * 10000).toLocaleString()}
                        </motion.span>
                      </div>
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={100}
                        step={1}
                        className={isBudgetExceeded ? "accent-red-500" : ""}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      残高: ¥{balance.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Ad Copy */}
                <div>
                  <Label
                    htmlFor="adCopy"
                    className="text-base font-semibold mb-3 block"
                  >
                    広告文
                  </Label>
                  <Textarea
                    id="adCopy"
                    value={adCopy}
                    onChange={(e) => setAdCopy(e.target.value)}
                    placeholder="魅力的な広告文を入力してください..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="w-full"
                  size="lg"
                >
                  AI 配信開始
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>ライブプレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-800 mb-1">
                        AI Agent
                      </div>
                      <motion.div
                        key={adCopy}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-700"
                      >
                        {adCopy || "広告文がここに表示されます..."}
                      </motion.div>
                      <div className="mt-3 text-xs text-gray-500">
                        スポンサー
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <div>
                    ターゲット:{" "}
                    {Object.entries(targeting)
                      .filter(([, checked]) => checked)
                      .map(([key]) => {
                        const labels = {
                          tokyo: "東京",
                          osaka: "大阪",
                          tech: "テクノロジー",
                          business: "ビジネス",
                        };
                        return labels[key as keyof typeof labels];
                      })
                      .join(", ") || "未設定"}
                  </div>
                  <div>予算: ¥{(budget[0] * 10000).toLocaleString()}/日</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
