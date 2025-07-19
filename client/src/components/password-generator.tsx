import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Settings, RefreshCw, Copy, HelpCircle } from "lucide-react"
import { generatePassword, copyToClipboard, type PasswordOptions } from "@/lib/password-utils"

export default function PasswordGenerator() {
  const { toast } = useToast()
  const [password, setPassword] = useState("Kp3$9nX@mL5&vB8!")
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: false,
    excludeDuplicates: false,
  })

  const handleGenerate = () => {
    try {
      const newPassword = generatePassword(options)
      setPassword(newPassword)
      toast({
        title: "Password Generated",
        description: "A new secure password has been generated.",
      })
    } catch (error) {
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate password",
        variant: "destructive",
      })
    }
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(password)
    if (success) {
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password to clipboard.",
        variant: "destructive",
      })
    }
  }

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="h-fit">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password Generator</h2>
        </div>

        {/* Generated Password Display */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Generated Password
          </Label>
          <div className="relative">
            <Input
              type="text"
              value={password}
              readOnly
              className="font-mono text-sm pr-12 bg-gray-50 dark:bg-gray-800/50"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click the copy icon to copy to clipboard
          </p>
        </div>

        {/* Password Length */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Password Length: <span className="text-blue-600 dark:text-blue-400 font-semibold">{options.length}</span>
          </Label>
          <Slider
            value={[options.length]}
            onValueChange={(value) => updateOption('length', value[0])}
            max={128}
            min={8}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Character Types */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Character Types
          </Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) => updateOption('includeUppercase', !!checked)}
              />
              <Label htmlFor="uppercase" className="text-sm text-gray-700 dark:text-gray-300">
                Uppercase Letters (A-Z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) => updateOption('includeLowercase', !!checked)}
              />
              <Label htmlFor="lowercase" className="text-sm text-gray-700 dark:text-gray-300">
                Lowercase Letters (a-z)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) => updateOption('includeNumbers', !!checked)}
              />
              <Label htmlFor="numbers" className="text-sm text-gray-700 dark:text-gray-300">
                Numbers (0-9)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) => updateOption('includeSymbols', !!checked)}
              />
              <Label htmlFor="symbols" className="text-sm text-gray-700 dark:text-gray-300">
                Symbols (!@#$%^&*)
              </Label>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Advanced Options
          </Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeAmbiguous"
                checked={options.excludeAmbiguous}
                onCheckedChange={(checked) => updateOption('excludeAmbiguous', !!checked)}
              />
              <Label htmlFor="excludeAmbiguous" className="text-sm text-gray-700 dark:text-gray-300">
                Exclude ambiguous characters
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48 text-xs">
                    Excludes characters like l, 1, I, O, 0 that can be easily confused
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeDuplicates"
                checked={options.excludeDuplicates}
                onCheckedChange={(checked) => updateOption('excludeDuplicates', !!checked)}
              />
              <Label htmlFor="excludeDuplicates" className="text-sm text-gray-700 dark:text-gray-300">
                Exclude duplicate characters
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48 text-xs">
                    Ensures no character appears more than once in the password
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New Password
        </Button>
      </CardContent>
    </Card>
  )
}
