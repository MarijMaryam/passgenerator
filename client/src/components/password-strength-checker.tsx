import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle, Clock, Lightbulb } from "lucide-react"
import { checkPasswordStrength, type StrengthResult } from "@/lib/password-utils"

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<StrengthResult | null>(null)

  useEffect(() => {
    const result = checkPasswordStrength(password)
    setStrength(result)
  }, [password])

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-red-400"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-green-600"
      default:
        return "bg-gray-300"
    }
  }

  const getFactorIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'bad':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getFactorStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'bad':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password Strength Checker</h2>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Enter Password to Check
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste your password here..."
              className="pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Your password is never transmitted or stored
          </p>
        </div>

        {strength && password && (
          <>
            {/* Strength Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength</span>
                <span className={`text-sm font-semibold ${
                  strength.score >= 3 ? 'text-green-600 dark:text-green-400' : 
                  strength.score >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-red-600 dark:text-red-400'
                }`}>
                  {strength.label}
                </span>
              </div>
              <Progress value={strength.percentage} className="h-2 mb-1" />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Weak</span>
                <span>Very Strong</span>
              </div>
            </div>

            {/* Strength Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Strength Factors</h3>
              <div className="space-y-2">
                {strength.factors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getFactorIcon(factor.status)}
                      <span className="text-sm text-gray-700 dark:text-gray-300">{factor.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${getFactorStatusColor(factor.status)}`}>
                      {factor.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Crack Time */}
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Estimated Crack Time</span>
                </div>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">{strength.crackTime}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Based on standard attack methods</p>
              </div>
            </div>

            {/* Improvement Suggestions */}
            {strength.suggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggestions for Improvement</h3>
                <div className="space-y-2">
                  {strength.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-amber-800 dark:text-amber-200">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!password && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Enter a password above to see its strength analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
