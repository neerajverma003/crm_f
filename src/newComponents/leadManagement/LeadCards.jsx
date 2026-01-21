// import React, { useEffect, useState } from "react";

// const LeadCards = () => {
//     const [leads, setLeads] = useState([]);

//     // Fetch leads from API
//     const fetchLeadData = async () => {
//         try {
//             const response = await fetch("http://localhost:4000/leads/");
//             const result = await response.json();
//             console.log(result);
//             if (result.success) {
//                 setLeads(result.data || result); // Adjust if API returns data array inside 'data'
//             } else {
//                 setLeads([]);
//             }
//         } catch (error) {
//             console.error("Error fetching lead data:", error);
//             setLeads([]);
//         }
//     };

//     useEffect(() => {
//         fetchLeadData();
//     }, []);
//   const hotLeads = leads.filter(
//     (lead) =>
//       (lead.status && lead.status.trim().toLowerCase() === "hot") ||
//       (lead.leadStatus && lead.leadStatus.trim().toLowerCase() === "hot")
//   ); 
//     const totalValue = leads.reduce((acc, lead) => {
//     const val = parseFloat(lead.value); // convert to number
//     return acc + (isNaN(val) ? 0 : val);
//   }, 0);   return (
//         <>
//             <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Total Leads</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{leads.length}</div>
//             </div>
//             <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Hot Leads</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{hotLeads.length}</div>
//             </div>

//                         <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//                 <div className="mb-6 flex w-full justify-between gap-6">
//                     <div className="text-xl font-semibold text-black">Total Value</div>
//                 </div>
//                 <div className="text-2xl font-semibold text-black">{totalValue}</div>
//             </div>
//         </>
//     );
// };

// export default LeadCards;

import React, { useEffect, useState } from "react";

const LeadCards = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    convertedLeads: 0,
    lostLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats from both endpoints
  const fetchLeadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [normalRes, empRes] = await Promise.all([
        fetch("http://localhost:4000/leads/stats"),
        fetch("http://localhost:4000/employeelead/stats"),
      ]);

      const normalStats = await normalRes.json();
      const empStats = await empRes.json();

      if (normalStats.success && empStats.success) {
        const normalData = normalStats.data || {};
        const empData = empStats.data || {};

        // Combine stats from both sources
        setStats({
          totalLeads:
            (normalData.totalLeads || 0) + (empData.totalLeads || 0),
          hotLeads: (normalData.hotLeads || 0) + (empData.hotLeads || 0),
          warmLeads:
            (normalData.warmLeads || 0) + (empData.warmLeads || 0),
          coldLeads: (normalData.coldLeads || 0) + (empData.coldLeads || 0),
          convertedLeads:
            (normalData.convertedLeads || 0) +
            (empData.convertedLeads || 0),
          lostLeads: (normalData.lostLeads || 0) + (empData.lostLeads || 0),
        });
      } else {
        setError("Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500">Loading statistics...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      {/* Total Leads */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Total Leads</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {stats.totalLeads}
        </div>
      </div>

      {/* Hot Leads */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Hot Leads</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {stats.hotLeads}
        </div>
      </div>

      {/* Warm Leads */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Warm Leads</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {stats.warmLeads}
        </div>
      </div>

      {/* Cold Leads */}
      <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
        <div className="mb-6 flex w-full justify-between gap-6">
          <div className="text-xl font-semibold text-black">Cold Leads</div>
        </div>
        <div className="text-2xl font-semibold text-black">
          {stats.coldLeads}
        </div>
      </div>
    </>
  );
};

export default LeadCards;
 