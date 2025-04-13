const Comparison = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 animate__animated animate__fadeIn">
          Why Choose Us Over Competitors
        </h2>
        <div className="overflow-x-auto animate__animated animate__fadeInUp">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Features</th>
                <th className="py-3 px-4 text-center">Our Service</th>
                <th className="py-3 px-4 text-center">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { feature: "No Hidden Fees", us: "✓", others: "Often" },
                { feature: "24/7 Support", us: "✓", others: "Limited" },
                { feature: "Free Cancellation", us: "48hrs", others: "72hrs" },
                { feature: "Loyalty Rewards", us: "✓", others: "✗" }
              ].map((row,i) => (
                <tr key={i} className={`hover:bg-blue-50 ${i%2===0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-3 px-4 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-green-600 font-bold">{row.us}</td>
                  <td className="py-3 px-4 text-center text-red-500">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );


  export default Comparison;