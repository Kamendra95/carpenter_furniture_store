import { Link } from 'react-router-dom'
import { Shield, Mail, Database, Lock, Truck, Eye, User, Clock, FileText } from 'lucide-react'

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: Shield,
    content: `
      <p>Welcome to Carpenter Furniture Store ("we," "our," "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or contact us for furniture inquiries.</p>
      <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.</p>
    `
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    icon: User,
    content: `
      <h4>Personal Information</h4>
      <p>We collect personal information that you voluntarily provide to us when you:</p>
      <ul>
        <li>Submit an inquiry or contact form</li>
        <li>Request a custom furniture quote</li>
        <li>Sign up for our newsletter (if applicable)</li>
        <li>Contact us via phone, email, or WhatsApp</li>
      </ul>
      <p>This information may include:</p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Delivery address (for inquiries)</li>
        <li>Project details and preferences</li>
        <li>Budget and timeline information (for custom requests)</li>
      </ul>
      
      <h4>Automatically Collected Information</h4>
      <p>When you visit our website, we may automatically collect certain information about your device and browsing behavior, including:</p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Referral source</li>
        <li>Pages visited and time spent</li>
        <li>Device identifiers</li>
      </ul>
      <p>We use cookies and similar tracking technologies to collect this information. See our Cookie Policy section below for more details.</p>
    `
  },
  {
    id: 'use-of-information',
    title: 'How We Use Your Information',
    icon: Database,
    content: `
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li><strong>To respond to inquiries:</strong> Process and respond to your furniture inquiries, custom requests, and questions.</li>
        <li><strong>To provide services:</strong> Manage your custom furniture projects, provide quotes, and coordinate delivery/installation.</li>
        <li><strong>To improve our services:</strong> Analyze website usage to enhance user experience and product offerings.</li>
        <li><strong>To communicate:</strong> Send you updates about your inquiry, promotional offers (with consent), and important notices.</li>
        <li><strong>For legal compliance:</strong> Comply with applicable laws, regulations, and legal processes.</li>
        <li><strong>For business operations:</strong> Manage our business, including accounting, auditing, and internal analysis.</li>
      </ul>
      <p>We will not use your personal information for purposes other than those described in this policy without your consent.</p>
    `
  },
  {
    id: 'sharing-information',
    title: 'Information Sharing and Disclosure',
    icon: Lock,
    content: `
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
      <ul>
        <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you (e.g., cloud hosting, analytics, communication tools). These providers are bound by confidentiality agreements.</li>
        <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation.</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of the business assets.</li>
        <li><strong>With Your Consent:</strong> For any other purpose with your explicit consent.</li>
      </ul>
      <p>We do not share your information with third parties for their own marketing purposes.</p>
    `
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: `
      <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
      <ul>
        <li>SSL/TLS encryption for data in transit</li>
        <li>Secure database storage with access controls</li>
        <li>Regular security assessments and updates</li>
        <li>Employee training on data protection</li>
        <li>Secure password hashing for admin accounts</li>
      </ul>
      <p>However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
    `
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    icon: Clock,
    content: `
      <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:</p>
      <ul>
        <li><strong>Inquiry Data:</strong> Retained for 3 years from the date of last contact for customer service and reference purposes.</li>
        <li><strong>Custom Project Data:</strong> Retained for 5 years after project completion for warranty and reference purposes.</li>
        <li><strong>Website Analytics Data:</strong> Retained for 26 months (Google Analytics default) or as per analytics provider policies.</li>
        <li><strong>Marketing Data:</strong> Retained until you unsubscribe or request deletion.</li>
      </ul>
      <p>You may request deletion of your data at any time (see Your Rights section).</p>
    `
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: Eye,
    content: `
      <p>Depending on your location, you may have the following rights regarding your personal information:</p>
      <ul>
        <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information.</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal obligations).</li>
        <li><strong>Right to Restrict Processing:</strong> Request limitation of how we process your data.</li>
        <li><strong>Right to Data Portability:</strong> Request your data in a structured, commonly used format.</li>
        <li><strong>Right to Object:</strong> Object to processing of your data for certain purposes.</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing where consent is the legal basis.</li>
      </ul>
      <p>To exercise any of these rights, please contact us using the information in the Contact Us section. We will respond within 30 days as required by applicable law.</p>
    `
  },
  {
    id: 'cookies',
    title: 'Cookies and Tracking Technologies',
    icon: FileText,
    content: `
      <p>Our website uses cookies and similar technologies to enhance your experience. Cookies are small text files stored on your device.</p>
      <h4>Types of Cookies We Use:</h4>
      <ul>
        <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., session management, security).</li>
        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
        <li><strong>Preference Cookies:</strong> Remember your preferences (e.g., language, region).</li>
      </ul>
      <h4>Managing Cookies:</h4>
      <p>You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, disabling essential cookies may affect website functionality.</p>
      <p>For analytics opt-out, you can use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-wood-700 underline">Google Analytics Opt-out Browser Add-on</a>.</p>
    `
  },
  {
    id: 'third-party-links',
    title: 'Third-Party Links',
    icon: Truck,
    content: `
      <p>Our website may contain links to third-party websites, including social media platforms (Facebook, Instagram, YouTube) and Google Maps for directions. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies before providing any personal information.</p>
    `
  },
  {
    id: 'children-privacy',
    title: 'Children\'s Privacy',
    icon: User,
    content: `
      <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us. We will take steps to delete such information from our records.</p>
    `
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    icon: Clock,
    content: `
      <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the new policy on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.</p>
      <p className="text-sm text-cream-500 mt-4">Last Updated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    `
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: Mail,
    content: `
      <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> privacy@carpenterfurniture.com</li>
        <li><strong>Phone:</strong> +91 98765 43210</li>
        <li><strong>Address:</strong> 123 Furniture Lane, Industrial Area, Bangalore - 560001, Karnataka, India</li>
      </ul>
      <p>You can also submit a request through our <Link to="/contact" className="text-wood-700 underline">Contact Form</Link>.</p>
    `
  }
]

export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in">
      <section className="bg-wood-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-cream-200 text-lg leading-relaxed">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <nav className="sticky top-24 space-y-1 bg-cream-50 p-4 rounded-xl" aria-label="Privacy policy navigation">
                <h3 className="font-semibold text-charcoal-900 mb-3 px-2">Contents</h3>
                <ul className="space-y-1">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block px-2 py-1.5 text-sm text-cream-600 hover:text-wood-700 rounded-lg transition-colors"
                      >
                        {index + 1}. {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            
            <div className="lg:col-span-3">
              <div className="prose prose-cream max-w-none space-y-12">
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-wood-700 flex-shrink-0">
                        <section.icon className="w-5 h-5" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-charcoal-900">{index + 1}. {section.title}</h2>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}