import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { performanceTester, PerformanceMetrics, runPerformanceTest } from '@/utils/performanceTest';
import { Play, Square, RefreshCw, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PerformanceTestPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const PerformanceTestPanel: React.FC<PerformanceTestPanelProps> = ({ 
  isVisible = false, 
  onClose 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [crossDeviceResults, setCrossDeviceResults] = useState<any>(null);
  const [accessibilityResults, setAccessibilityResults] = useState<any>(null);
  const [realTimeFPS, setRealTimeFPS] = useState(0);

  // Real-time FPS monitoring
  useEffect(() => {
    if (isRunning) {
      performanceTester.startFPSMeasurement();
      
      const interval = setInterval(() => {
        const fps = performanceTester.stopFPSMeasurement();
        setRealTimeFPS(fps);
        performanceTester.startFPSMeasurement();
      }, 1000);

      return () => {
        clearInterval(interval);
        performanceTester.stopFPSMeasurement();
      };
    }
  }, [isRunning]);

  const handleStartTest = async () => {
    setIsRunning(true);
    try {
      const result = await runPerformanceTest();
      if (result) {
        setCurrentMetrics(result.metrics);
        setAccessibilityResults(result.accessibility);
      }
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCrossDeviceTest = async () => {
    setIsRunning(true);
    try {
      const results = await performanceTester.testCrossDevicePerformance();
      setCrossDeviceResults(results);
    } catch (error) {
      console.error('Cross-device test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopTest = () => {
    setIsRunning(false);
    performanceTester.stopFPSMeasurement();
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'bg-green-500';
    if (fps >= 45) return 'bg-yellow-500';
    if (fps >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPerformanceLabel = (fps: number) => {
    if (fps >= 55) return 'Excellent';
    if (fps >= 45) return 'Good';
    if (fps >= 30) return 'Fair';
    return 'Poor';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Mobile Performance Test Panel
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Real-time FPS Monitor */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="font-medium">Real-time FPS:</span>
              <Badge className={`${getPerformanceColor(realTimeFPS)} text-white`}>
                {realTimeFPS} fps
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={handleStartTest} size="sm" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Test
                </Button>
              ) : (
                <Button onClick={handleStopTest} size="sm" variant="destructive" className="flex items-center gap-2">
                  <Square className="w-4 h-4" />
                  Stop Test
                </Button>
              )}
              
              <Button 
                onClick={handleCrossDeviceTest} 
                size="sm" 
                variant="outline"
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Cross-Device Test
              </Button>
            </div>
          </div>

          {/* Current Performance Metrics */}
          {currentMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Device Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentMetrics.fps}</div>
                    <div className="text-sm text-muted-foreground">FPS</div>
                    <Badge className={`${getPerformanceColor(currentMetrics.fps)} text-white mt-1`}>
                      {getPerformanceLabel(currentMetrics.fps)}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentMetrics.renderTime.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Render Time (ms)</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentMetrics.memoryUsage}</div>
                    <div className="text-sm text-muted-foreground">Memory Usage (%)</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentMetrics.deviceInfo.devicePixelRatio}</div>
                    <div className="text-sm text-muted-foreground">Device Pixel Ratio</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile Device:</span>
                    <Badge variant={currentMetrics.deviceInfo.isMobile ? "default" : "secondary"}>
                      {currentMetrics.deviceInfo.isMobile ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>Low-End Device:</span>
                    <Badge variant={currentMetrics.deviceInfo.isLowEnd ? "destructive" : "default"}>
                      {currentMetrics.deviceInfo.isLowEnd ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cross-Device Results */}
          {crossDeviceResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cross-Device Performance Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(crossDeviceResults).map(([deviceName, metrics]: [string, any]) => (
                    <div key={deviceName} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {deviceName.includes('tablet') ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                        <span className="font-medium">
                          {deviceName.replace('mobile', '').replace('tablet', 'Tablet ')}px
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>FPS:</span>
                          <Badge className={`${getPerformanceColor(metrics.fps)} text-white`}>
                            {metrics.fps}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Render:</span>
                          <span className="text-sm">{metrics.renderTime.toFixed(1)}ms</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span className="text-sm">{metrics.memoryUsage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accessibility Results */}
          {accessibilityResults && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accessibility Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span>Reduced Motion:</span>
                    <Badge variant={accessibilityResults.reducedMotion ? "default" : "secondary"}>
                      {accessibilityResults.reducedMotion ? 'Supported' : 'Not Detected'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>High Contrast:</span>
                    <Badge variant={accessibilityResults.highContrast ? "default" : "secondary"}>
                      {accessibilityResults.highContrast ? 'Supported' : 'Not Detected'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Touch Targets:</span>
                    <Badge variant={accessibilityResults.touchTargets ? "default" : "destructive"}>
                      {accessibilityResults.touchTargets ? 'Compliant' : 'Issues Found'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Keyboard Nav:</span>
                    <Badge variant={accessibilityResults.keyboardNavigation ? "default" : "destructive"}>
                      {accessibilityResults.keyboardNavigation ? 'Available' : 'Missing'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>Start Test:</strong> Measures performance for 3 seconds on current screen size</p>
              <p>• <strong>Cross-Device Test:</strong> Tests performance across 320px, 375px, 414px, and 768px screen sizes</p>
              <p>• <strong>Target:</strong> 60fps for smooth animations and interactions</p>
              <p>• <strong>Accessibility:</strong> Checks compliance with WCAG guidelines</p>
              <p>• Open browser DevTools → Performance tab for detailed analysis</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTestPanel;
