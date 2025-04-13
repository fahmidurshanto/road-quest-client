import { FaSearch, FaCalendarAlt, FaCarSide, FaCreditCard } from "react-icons/fa";

const HowItWorks = () => (
  <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-16 animate__animated animate__fadeIn">
        Rent a Car in 4 Easy Steps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: <FaSearch size={40} />, title: "Search", desc: "Find your perfect vehicle" },
          { icon: <FaCalendarAlt size={40} />, title: "Book", desc: "Select dates & location" },
          { icon: <FaCarSide size={40} />, title: "Pick Up", desc: "Get your keys at location" },
          { icon: <FaCreditCard size={40} />, title: "Pay", desc: "Simple secure payment" }
        ].map((step, i) => (
          <div key={i} className={`animate__animated animate__fadeInUp animate__delay-${i+1}s`}>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center h-full transform hover:scale-105 transition-all">
              <div className="text-blue-600 mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;