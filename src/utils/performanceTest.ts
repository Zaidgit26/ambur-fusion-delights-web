/**
 * Performance testing utilities for mobile optimization verification
 * Tests 60fps performance across different mobile screen sizes
 */

export interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsage: number;
  deviceInfo: {
    screenWidth: number;
    screenHeight: number;
    devicePixelRatio: number;
    isMobile: boolean;
    isLowEnd: boolean;
  };
}

export class MobilePerformanceTester {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private isRunning = false;
  private animationId: number | null = null;

  constructor() {
    this.measureFPS = this.measureFPS.bind(this);
  }

  /**
   * Start measuring FPS performance
   */
  startFPSMeasurement(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.measureFPS);
  }

  /**
   * Stop measuring FPS performance
   */
  stopFPSMeasurement(): number {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
    return this.fps;
  }

  /**
   * Measure FPS using requestAnimationFrame
   */
  private measureFPS(currentTime: number): void {
    this.frameCount++;
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    if (this.isRunning) {
      this.animationId = requestAnimationFrame(this.measureFPS);
    }
  }

  /**
   * Get current device performance metrics
   */
  getDeviceMetrics(): PerformanceMetrics['deviceInfo'] {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      screenWidth: width,
      screenHeight: height,
      devicePixelRatio: window.devicePixelRatio || 1,
      isMobile: width <= 768,
      isLowEnd: this.detectLowEndDevice()
    };
  }

  /**
   * Detect if device is low-end based on various factors
   */
  private detectLowEndDevice(): boolean {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;
    
    let score = 0;
    
    // CPU cores
    score += Math.min(cores * 10, 40);
    
    // Memory
    score += Math.min(memory * 10, 30);
    
    // Connection speed
    if (connection) {
      switch (connection.effectiveType) {
        case '4g': score += 20; break;
        case '3g': score += 10; break;
        case '2g': score += 5; break;
        default: score += 15;
      }
    } else {
      score += 15;
    }
    
    return score < 50;
  }

  /**
   * Get memory usage if available
   */
  getMemoryUsage(): number {
    const memory = (performance as any).memory;
    if (memory) {
      return Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
    }
    return 0;
  }

  /**
   * Test animation performance for a specific duration
   */
  async testAnimationPerformance(durationMs: number = 3000): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      this.startFPSMeasurement();
      
      setTimeout(() => {
        const fps = this.stopFPSMeasurement();
        const renderTime = performance.now() - startTime;
        
        resolve({
          fps,
          renderTime,
          memoryUsage: this.getMemoryUsage(),
          deviceInfo: this.getDeviceMetrics()
        });
      }, durationMs);
    });
  }

  /**
   * Test performance across different screen sizes
   */
  async testCrossDevicePerformance(): Promise<{
    mobile320: PerformanceMetrics;
    mobile375: PerformanceMetrics;
    mobile414: PerformanceMetrics;
    tablet768: PerformanceMetrics;
  }> {
    const results = {} as any;
    
    // Test different screen sizes
    const screenSizes = [
      { width: 320, height: 568, name: 'mobile320' },
      { width: 375, height: 667, name: 'mobile375' },
      { width: 414, height: 896, name: 'mobile414' },
      { width: 768, height: 1024, name: 'tablet768' }
    ];
    
    for (const size of screenSizes) {
      // Simulate screen size change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: size.width
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: size.height
      });
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Test performance
      results[size.name] = await this.testAnimationPerformance(2000);
    }
    
    return results;
  }

  /**
   * Generate performance report
   */
  generateReport(metrics: PerformanceMetrics): string {
    const { fps, renderTime, memoryUsage, deviceInfo } = metrics;
    
    let report = `Performance Report:\n`;
    report += `==================\n`;
    report += `FPS: ${fps} (Target: 60fps)\n`;
    report += `Render Time: ${renderTime.toFixed(2)}ms\n`;
    report += `Memory Usage: ${memoryUsage}%\n`;
    report += `Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}\n`;
    report += `Device Pixel Ratio: ${deviceInfo.devicePixelRatio}\n`;
    report += `Mobile Device: ${deviceInfo.isMobile ? 'Yes' : 'No'}\n`;
    report += `Low-End Device: ${deviceInfo.isLowEnd ? 'Yes' : 'No'}\n`;
    
    // Performance assessment
    if (fps >= 55) {
      report += `\n✅ Performance: EXCELLENT (60fps target achieved)\n`;
    } else if (fps >= 45) {
      report += `\n⚠️ Performance: GOOD (Close to 60fps target)\n`;
    } else if (fps >= 30) {
      report += `\n⚠️ Performance: FAIR (Below 60fps target)\n`;
    } else {
      report += `\n❌ Performance: POOR (Significant optimization needed)\n`;
    }
    
    return report;
  }

  /**
   * Test accessibility compliance
   */
  testAccessibility(): {
    reducedMotion: boolean;
    highContrast: boolean;
    touchTargets: boolean;
    keyboardNavigation: boolean;
  } {
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      touchTargets: this.checkTouchTargets(),
      keyboardNavigation: this.checkKeyboardNavigation()
    };
  }

  /**
   * Check if touch targets meet minimum size requirements (44px)
   */
  private checkTouchTargets(): boolean {
    const buttons = document.querySelectorAll('button, [role="button"], a');
    let compliant = true;
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        compliant = false;
      }
    });
    
    return compliant;
  }

  /**
   * Check basic keyboard navigation support
   */
  private checkKeyboardNavigation(): boolean {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    return focusableElements.length > 0;
  }
}

// Export singleton instance
export const performanceTester = new MobilePerformanceTester();

// Development helper function
export const runPerformanceTest = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Starting Mobile Performance Test...');
    
    const metrics = await performanceTester.testAnimationPerformance(3000);
    const report = performanceTester.generateReport(metrics);
    const accessibility = performanceTester.testAccessibility();
    
    console.log(report);
    console.log('\nAccessibility Check:');
    console.log('Reduced Motion Support:', accessibility.reducedMotion);
    console.log('High Contrast Support:', accessibility.highContrast);
    console.log('Touch Targets Compliant:', accessibility.touchTargets);
    console.log('Keyboard Navigation:', accessibility.keyboardNavigation);
    
    return { metrics, accessibility };
  }
};
