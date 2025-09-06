/**
 * OpenAI Integration for Client-Side AI Features
 * This is a temporary client-side implementation that will be replaced with backend APIs
 */

interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface JobDescriptionParams {
  jobTitle?: string;
  company?: string;
  industry?: string;
  experience?: string;
  skills?: string[];
  location?: string;
}

interface ResumeAnalysisParams {
  resumeContent: string;
  jobDescription?: string;
}

class OpenAIClient {
  private config: OpenAIConfig;
  private isConfigured: boolean = false;

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7,
    };

    this.isConfigured = !!this.config.apiKey;
  }

  private async makeRequest(messages: any[]): Promise<AIResponse> {
    if (!this.isConfigured) {
      // Fallback to mock responses when API key is not configured
      return this.getMockResponse(messages);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to mock response on error
      return this.getMockResponse(messages);
    }
  }

  private async getMockResponse(messages: any[]): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lastMessage = messages[messages.length - 1]?.content || '';

    // Generate appropriate mock response based on the request
    if (lastMessage.includes('job description')) {
      return {
        content: this.generateMockJobDescription(),
        usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
      };
    } else if (lastMessage.includes('resume analysis') || lastMessage.includes('analyze')) {
      return {
        content: this.generateMockAnalysis(),
        usage: { prompt_tokens: 150, completion_tokens: 250, total_tokens: 400 },
      };
    }

    return {
      content:
        'I apologize, but I cannot process this request at the moment. Please try again later.',
      usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
    };
  }

  private generateMockJobDescription(): string {
    const templates = [
      `**Senior Software Engineer**

We are seeking a talented Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.

**Key Responsibilities:**
• Design and develop robust, scalable web applications
• Collaborate with cross-functional teams to deliver high-quality solutions
• Write clean, maintainable, and well-documented code
• Participate in code reviews and mentor junior developers
• Optimize application performance and ensure high availability

**Required Qualifications:**
• Bachelor's degree in Computer Science or related field
• 5+ years of experience in software development
• Strong proficiency in JavaScript, React, Node.js, and database technologies
• Experience with cloud platforms (AWS, Azure, or GCP)
• Excellent problem-solving and communication skills

**What We Offer:**
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (remote/hybrid)
• Professional development opportunities`,

      `**Product Manager**

Join our team as a Product Manager where you'll drive product strategy and execution for our innovative platform. You'll work closely with engineering, design, and business teams to deliver exceptional user experiences.

**Key Responsibilities:**
• Define and execute product roadmap and strategy
• Conduct market research and competitive analysis
• Work with engineering teams to deliver features on time
• Analyze user data and feedback to inform product decisions
• Collaborate with design team on user experience

**Required Qualifications:**
• Bachelor's degree in Business, Engineering, or related field
• 3+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with agile development methodologies
• Excellent communication and leadership skills

**Preferred Qualifications:**
• MBA or advanced degree
• Experience in SaaS products
• Technical background with understanding of software development`,
    ];

    return templates[Math.floor(Math.random() * templates.length)] || '';
  }

  private generateMockAnalysis(): string {
    return `**Resume Analysis Results**

**Strengths:**
• Strong technical background with relevant experience
• Clear and well-structured resume format
• Quantified achievements with specific metrics
• Good alignment with industry standards

**Areas for Improvement:**
• Add more measurable achievements instead of just duties
• Include a professional summary at the top
• Consider adding relevant certifications
• Optimize keywords for ATS compatibility

**Recommendations:**
• Tailor your resume to specific job descriptions
• Use action verbs to start bullet points
• Include relevant portfolio links or GitHub profile
• Consider adding volunteer work or side projects

**Overall Score: 78/100**
Your resume shows strong potential with some areas for enhancement.`;
  }

  async generateJobDescription(params: JobDescriptionParams): Promise<AIResponse> {
    const prompt = `Generate a professional job description for the following position:

Job Title: ${params.jobTitle || 'Software Engineer'}
Company: ${params.company || 'Tech Company'}
Industry: ${params.industry || 'Technology'}
Experience Level: ${params.experience || '3-5 years'}
Key Skills: ${params.skills?.join(', ') || 'Programming, Problem Solving'}
Location: ${params.location || 'Remote/Hybrid'}

Please include:
- Brief company/role overview
- Key responsibilities (5-7 bullet points)
- Required qualifications
- Preferred qualifications
- What the company offers (benefits, culture)

Format the response professionally with clear sections and bullet points.`;

    return this.makeRequest([
      {
        role: 'system',
        content:
          'You are a professional HR specialist creating detailed job descriptions. Be specific, professional, and include realistic requirements and benefits.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  async analyzeResume(params: ResumeAnalysisParams): Promise<AIResponse> {
    const prompt = `Analyze the following resume${params.jobDescription ? ' against the provided job description' : ''}:

RESUME CONTENT:
${params.resumeContent}

${
  params.jobDescription
    ? `JOB DESCRIPTION:
${params.jobDescription}`
    : ''
}

Please provide:
1. Key strengths of the resume
2. Areas for improvement
3. Specific recommendations
4. ${params.jobDescription ? 'How well the resume matches the job description' : 'General assessment of resume quality'}
5. An overall score (1-100)

Be constructive and specific in your feedback.`;

    return this.makeRequest([
      {
        role: 'system',
        content:
          'You are a professional resume expert and career coach. Provide detailed, constructive feedback on resumes. Be specific about improvements and highlight both strengths and weaknesses.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  async optimizeResumeContent(resumeContent: string, jobDescription?: string): Promise<AIResponse> {
    const prompt = `Please optimize the following resume content${jobDescription ? ' for the specific job description provided' : ' for general improvement'}:

CURRENT RESUME:
${resumeContent}

${
  jobDescription
    ? `TARGET JOB DESCRIPTION:
${jobDescription}`
    : ''
}

Please provide an optimized version that:
- Uses stronger action verbs
- Includes more quantified achievements
- Is better formatted for ATS systems
- ${jobDescription ? 'Better matches the job requirements and keywords' : 'Follows industry best practices'}
- Maintains the original experience but presents it more effectively

Provide the optimized content in a clean, professional format.`;

    return this.makeRequest([
      {
        role: 'system',
        content:
          'You are a professional resume writer with expertise in ATS optimization and industry best practices. Help improve resume content while maintaining accuracy and professionalism.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }
}

// Export singleton instance
export const aiClient = new OpenAIClient();

// Export types
export type { AIResponse, JobDescriptionParams, ResumeAnalysisParams };
