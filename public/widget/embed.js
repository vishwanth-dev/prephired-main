/**
 * prepAI Interview Widget - Embed Script
 * Version: 1.0.0
 *
 * This script allows companies to embed AI-powered voice interviews
 * directly on their websites without redirecting candidates.
 */

(function () {
  'use strict';

  // Widget configuration and state
  let config = {};
  let widgetState = {
    isLoaded: false,
    isInterviewing: false,
    currentCandidate: null,
    sessionId: null,
  };

  // DOM elements
  let widgetContainer = null;
  let widgetIframe = null;

  /**
   * Initialize the widget
   */
  function init(options = {}) {
    console.log('prepAI Widget: Initializing...');

    // Load configuration
    loadConfig()
      .then(() => {
        // Merge with custom options
        config = { ...config, ...options };

        // Create widget container
        createWidgetContainer();

        // Load widget interface
        loadWidgetInterface();

        // Set up event listeners
        setupEventListeners();

        widgetState.isLoaded = true;
        console.log('prepAI Widget: Initialized successfully');
      })
      .catch(error => {
        console.error('prepAI Widget: Initialization failed', error);
      });
  }

  /**
   * Load widget configuration
   */
  async function loadConfig() {
    try {
      const response = await fetch('/public/widget/config.json');
      config = await response.json();
    } catch (error) {
      console.error('Failed to load widget config:', error);
      // Fallback to default config
      config = getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   */
  function getDefaultConfig() {
    return {
      widget: {
        name: 'prepAI Interview Widget',
        version: '1.0.0',
      },
      ui: {
        theme: 'light',
        primaryColor: '#2563eb',
      },
      api: {
        baseUrl: window.location.origin,
      },
      features: {
        voiceInterviews: true,
        resumeAnalysis: true,
      },
    };
  }

  /**
   * Create widget container
   */
  function createWidgetContainer() {
    // Remove existing container if any
    const existing = document.getElementById('prepai-widget-container');
    if (existing) {
      existing.remove();
    }

    // Create new container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'prepai-widget-container';
    widgetContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      display: none;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    `;

    document.body.appendChild(widgetContainer);
  }

  /**
   * Load widget interface
   */
  function loadWidgetInterface() {
    // Create iframe for widget content
    widgetIframe = document.createElement('iframe');
    widgetIframe.src = `${config.api.baseUrl}/public/widget/interface`;
    widgetIframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
    `;

    widgetContainer.appendChild(widgetIframe);
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Listen for messages from iframe
    window.addEventListener('message', handleWidgetMessage);

    // Listen for widget API calls
    window.prepAIWidget = {
      open: openWidget,
      close: closeWidget,
      startInterview: startInterview,
      uploadResume: uploadResume,
      getAnalytics: getAnalytics,
    };
  }

  /**
   * Handle messages from widget iframe
   */
  function handleWidgetMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'WIDGET_READY':
        console.log('prepAI Widget: Interface loaded');
        break;

      case 'INTERVIEW_STARTED':
        widgetState.isInterviewing = true;
        widgetState.sessionId = data.sessionId;
        console.log('prepAI Widget: Interview started', data);
        break;

      case 'INTERVIEW_COMPLETED':
        widgetState.isInterviewing = false;
        console.log('prepAI Widget: Interview completed', data);
        // Trigger custom event
        document.dispatchEvent(new CustomEvent('prepai-interview-completed', { detail: data }));
        break;

      case 'RESUME_UPLOADED':
        console.log('prepAI Widget: Resume uploaded', data);
        break;

      case 'ERROR':
        console.error('prepAI Widget Error:', data);
        break;
    }
  }

  /**
   * Open the widget
   */
  function openWidget() {
    if (widgetContainer) {
      widgetContainer.style.display = 'block';
      // Send message to iframe
      widgetIframe.contentWindow.postMessage({ type: 'OPEN_WIDGET' }, '*');
    }
  }

  /**
   * Close the widget
   */
  function closeWidget() {
    if (widgetContainer) {
      widgetContainer.style.display = 'none';
      // Send message to iframe
      widgetIframe.contentWindow.postMessage({ type: 'CLOSE_WIDGET' }, '*');
    }
  }

  /**
   * Start an interview
   */
  function startInterview(candidateData = {}) {
    if (!widgetState.isLoaded) {
      console.error('prepAI Widget: Not initialized');
      return;
    }

    widgetState.currentCandidate = candidateData;

    // Send message to iframe
    widgetIframe.contentWindow.postMessage(
      {
        type: 'START_INTERVIEW',
        data: candidateData,
      },
      '*'
    );
  }

  /**
   * Upload resume
   */
  function uploadResume(file) {
    if (!widgetState.isLoaded) {
      console.error('prepAI Widget: Not initialized');
      return;
    }

    // Send message to iframe
    widgetIframe.contentWindow.postMessage(
      {
        type: 'UPLOAD_RESUME',
        data: { file },
      },
      '*'
    );
  }

  /**
   * Get analytics data
   */
  function getAnalytics() {
    return {
      isLoaded: widgetState.isLoaded,
      isInterviewing: widgetState.isInterviewing,
      sessionId: widgetState.sessionId,
      config: config,
    };
  }

  /**
   * Create floating button
   */
  function createFloatingButton() {
    const button = document.createElement('button');
    button.id = 'prepai-floating-button';
    button.innerHTML = '🎙️ Start Interview';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${config.ui.primaryColor || '#2563eb'};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    `;

    button.addEventListener('click', openWidget);
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    document.body.appendChild(button);
  }

  // Auto-initialize if data-prepai attribute is present
  document.addEventListener('DOMContentLoaded', () => {
    const autoInitElement = document.querySelector('[data-prepai]');
    if (autoInitElement) {
      const options = JSON.parse(autoInitElement.getAttribute('data-prepai') || '{}');
      init(options);
      createFloatingButton();
    }
  });

  // Expose init function globally
  window.prepAIInit = init;

  console.log('prepAI Widget: Script loaded successfully');
})();
