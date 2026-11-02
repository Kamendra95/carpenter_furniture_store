import { Link } from 'react-router-dom'
import { TreePine, Award, Heart, Users, Clock, Sparkles, Shield, Truck, Home } from 'lucide-react'
import api from '../../services/api'
import { useState, useEffect } from 'react'
import Button from '../../components/Button'

const stats = [
  { icon: Award, value: '25+', label: 'Years of Excellence' },
  { icon: Heart, value: '5000+', label: 'Happy Customers' },
  { icon: TreePine, value: '10000+', label: 'Pieces Crafted' },
  { icon: Users, value: '15+', label: 'Master Carpenters' }
]

const values = [
  { icon: Shield, title: 'Uncompromising Quality', description: 'Every piece undergoes rigorous quality checks at multiple stages of production.' },
  { icon: Heart, title: 'Handcrafted with Love', description: 'Our master carpenters pour their expertise and passion into every joint and finish.' },
  { icon: Sparkles, title: 'Sustainable Practices', description: 'We source wood responsibly and minimize waste in our workshop.' },
  { icon: Clock, title: 'Timeless Design', description: 'Furniture that transcends trends and becomes a family heirloom.' },
  { icon: Home, title: 'Custom Solutions', description: 'Your vision, our craftsmanship - furniture made for your unique space.' },
  { icon: Truck, title: 'Reliable Delivery', description: 'Safe, professional delivery and installation services available.' }
]

const team = [
  { name: 'Rajesh Kumar', role: 'Founder & Master Carpenter', experience: '30 years', specialty: 'Traditional Joinery' },
  { name: 'Priya Sharma', role: 'Design Director', experience: '15 years', specialty: 'Contemporary Furniture Design' },
  { name: 'Amit Patel', role: 'Workshop Manager', experience: '20 years', specialty: 'Production & Quality Control' },
  { name: 'Sunita Reddy', role: 'Custom Projects Lead', experience: '12 years', specialty: 'Bespoke Furniture' }
]

export default function About() {
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    fetchSettings()
  }, [])
  
  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public')
      setSettings(response.data.data)
    } catch {}
  }
  
  return (
    <div className="animate-fade-in">
      <section className="bg-wood-900 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 rounded-full bg-wood-600/30 text-wood-200 text-sm font-medium mb-6 border border-wood-600/50">
              Our Story
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Crafting{' '}
              <span className="text-wood-300">Timeless Furniture</span>
              {' '}Since 1995
            </h1>
            <p className="text-cream-200 text-lg leading-relaxed mb-8 max-w-2xl">
              Three decades of mastery in woodworking, blending traditional techniques 
              with contemporary design to create furniture that lasts generations.
            </p>
            <Link to="/contact" className="btn-whatsapp inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
      
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-cream-50 rounded-xl animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="font-serif text-3xl font-bold text-charcoal-900">{stat.value}</div>
                <div className="text-cream-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-wood-800">
              <div className="absolute inset-0 bg-gradient-to-br from-wood-700/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TreePine className="w-48 h-48 text-wood-300 opacity-50" />
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-6">Our Heritage</h2>
              <div className="prose prose-cream max-w-none text-cream-700 leading-relaxed space-y-4">
                <p>
                  Founded in 1995 by master carpenter Rajesh Kumar, Carpenter Furniture Store began as a small workshop 
                  in Bangalore with a simple mission: to create furniture that combines the warmth of traditional 
                  craftsmanship with the precision of modern design.
                </p>
                <p>
                  Over the past 25 years, we have grown from a modest workshop to a trusted name in premium furniture, 
                  serving thousands of homes across India. Yet our core philosophy remains unchanged - every piece 
                  that leaves our workshop carries the signature of handcrafted excellence.
                </p>
                <p>
                  Today, our team of 15+ master carpenters continues this legacy, working with premium woods like 
                  teak, sheesham, mango, and acacia to create furniture that tells a story. From the selection of 
                  timber to the final polish, every step is guided by expertise passed down through generations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 mb-6">Our Craftsmanship</h2>
              <div className="prose prose-cream max-w-none text-cream-700 leading-relaxed space-y-4">
                <p>
                  True craftsmanship lies in the details. Our carpenters use traditional joinery techniques - 
                  mortise and tenon, dovetail, and finger joints - that have stood the test of time. 
                  No nails, no shortcuts, just pure woodworking mastery.
                </p>
                <p>
                  We source our wood from sustainable plantations, ensuring each piece is not only beautiful 
                  but environmentally responsible. Our finishes are hand-applied using premium oils and waxes 
                  that enhance the natural grain while providing lasting protection.
                </p>
                <p>
                  Whether it's a grand four-poster bed or a simple dining chair, every piece receives the same 
                  meticulous attention. This dedication to craft is why our furniture becomes part of your 
                  family's story for generations.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-wood-800">
              <div className="absolute inset-0 bg-gradient-to-br from-wood-700/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <TreePine className="w-48 h-48 text-wood-300 opacity-50" />
              </div>
            </div>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {values.map((value, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-wood-700 mb-4">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-charcoal-900 mb-2">{value.title}</h3>
                <p className="text-cream-600">{value.description}</p>
              </div>
            ))}
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-900 text-center mb-12">Meet Our Masters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-wood-100 flex items-center justify-center">
                  <TreePine className="w-12 h-12 text-wood-600" />
                </div>
                <h3 className="font-semibold text-charcoal-900">{member.name}</h3>
                <p className="text-sm text-wood-600 font-medium mb-1">{member.role}</p>
                <p className="text-xs text-cream-500 mb-2">{member.experience} • {member.specialty}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-wood-900 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-cream-300 text-lg mb-8 max-w-2xl mx-auto">
              Let our master carpenters bring your vision to life. Schedule a consultation 
              to discuss your custom furniture project.
            </p>
            <Link to="/custom-furniture" className="btn-whatsapp inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Request Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}