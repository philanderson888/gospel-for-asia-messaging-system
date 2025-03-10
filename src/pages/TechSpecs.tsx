import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Server, Database, Shield, Code, Globe } from 'lucide-react';

export default function TechSpecs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Technical Specifications
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Comprehensive technical overview of the Bridge of Hope Messaging System
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {/* Frontend Architecture */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Frontend Architecture
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>React 18.3.1 with TypeScript for type safety</li>
                  <li>Vite 5.4.2 for fast development and optimized builds</li>
                  <li>React Router 6.22.2 for client-side routing</li>
                  <li>Tailwind CSS 3.4.1 for responsive styling</li>
                  <li>Lucide React for consistent iconography</li>
                  <li>React Hot Toast for user notifications</li>
                </ul>
              </dd>
            </div>

            {/* Backend Infrastructure */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Server className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Backend Infrastructure
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Supabase for backend services</li>
                  <li>PostgreSQL database with Row Level Security</li>
                  <li>Real-time subscriptions capability</li>
                  <li>Automated database backups</li>
                  <li>Scalable serverless architecture</li>
                </ul>
              </dd>
            </div>

            {/* Database Design */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Database Design
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Normalized schema design</li>
                  <li>Foreign key constraints for data integrity</li>
                  <li>Indexed fields for query optimization</li>
                  <li>UUID primary keys for security</li>
                  <li>Timestamp tracking for all records</li>
                  <li>Role-based access control</li>
                </ul>
              </dd>
            </div>

            {/* Security Measures */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Security Measures
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>JWT-based authentication</li>
                  <li>Row Level Security policies</li>
                  <li>Role-based access control</li>
                  <li>Input validation and sanitization</li>
                  <li>Secure password hashing</li>
                  <li>HTTPS-only communication</li>
                </ul>
              </dd>
            </div>

            {/* Development Environment */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Development Environment
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Node.js runtime environment</li>
                  <li>npm package management</li>
                  <li>ESLint for code quality</li>
                  <li>TypeScript for type checking</li>
                  <li>Git version control</li>
                  <li>Automated deployment pipeline</li>
                </ul>
              </dd>
            </div>

            {/* Integration Capabilities */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-indigo-600" />
                <dt className="ml-2 text-lg leading-6 font-medium text-gray-900">
                  Integration Capabilities
                </dt>
              </div>
              <dd className="mt-2 text-base text-gray-500">
                <ul className="list-disc pl-5 space-y-2">
                  <li>RESTful API endpoints</li>
                  <li>WebSocket support for real-time updates</li>
                  <li>OAuth2 authentication ready</li>
                  <li>Extensible data models</li>
                  <li>Webhook support for external integrations</li>
                  <li>API documentation available</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Minimum Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>JavaScript enabled</li>
                <li>Stable internet connection</li>
                <li>1024x768 minimum screen resolution</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recommended Setup</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Chrome or Firefox latest version</li>
                <li>High-speed internet connection</li>
                <li>1920x1080 or higher resolution</li>
                <li>Modern mobile device for responsive features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}