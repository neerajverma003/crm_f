// // import React, { useState, useEffect } from 'react';
// // import { Download, MapPin, Calendar, FileText, Loader2 } from 'lucide-react';

// // export default function AllItinerary() {
// //   const [itineraries, setItineraries] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [selectedItinerary, setSelectedItinerary] = useState(null); // full-page view

// //   useEffect(() => {
// //     fetchItineraries();
// //   }, []);

// //   const fetchItineraries = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch('http://localhost:4000/itinerary/');
// //       if (!response.ok) throw new Error('Failed to fetch itineraries');
// //       const result = await response.json();
// //       if (result.success && result.data) {
// //         setItineraries(result.data);
// //       } else {
// //         throw new Error('Invalid data format');
// //       }
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDownload = (url, destination, index) => {
// //     const link = document.createElement('a');
// //     link.href = url;
// //     link.download = `${destination}_Itinerary_${index + 1}.pdf`;
// //     link.target = '_blank';
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
// //         <div className="text-center">
// //           <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
// //           <p className="text-lg text-gray-600">Loading itineraries...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
// //         <div className="p-6 bg-white rounded-lg shadow-lg">
// //           <div className="flex items-center mb-4 text-red-600">
// //             <FileText className="w-6 h-6 mr-2" />
// //             <h2 className="text-xl font-semibold">Error Loading Itineraries</h2>
// //           </div>
// //           <p className="text-gray-600">{error}</p>
// //           <button
// //             onClick={fetchItineraries}
// //             className="px-4 py-2 mt-4 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
// //           >
// //             Try Again
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Full-page view for selected itinerary
// //   if (selectedItinerary) {
// //     return (
// //       <div className="min-h-screen px-4 py-12 bg-[#F9FAFB]">
// //         <div className="max-w-4xl mx-auto">
// //           <button
// //             onClick={() => setSelectedItinerary(null)}
// //             className="mb-6 px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700"
// //           >
// //             Back to All Itineraries
// //           </button>

// //           <h1 className="mb-6 text-3xl font-bold text-gray-800">
// //             {selectedItinerary.Destination} Itineraries
// //           </h1>

// //           <div className="flex flex-col gap-4">
// //             {selectedItinerary.Upload.map((pdfUrl, idx) => (
// //               <div
// //                 key={idx}
// //                 className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
// //               >
// //                 <span className="truncate font-medium">{`Itinerary PDF ${idx + 1}`}</span>
// //                 <button
// //                   onClick={() =>
// //                     handleDownload(pdfUrl, selectedItinerary.Destination, idx)
// //                   }
// //                   className="flex items-center gap-2 px-3 py-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
// //                 >
// //                   <Download className="w-4 h-4" /> Download
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Main list view
// //   return (
// //     <div className="min-h-screen px-4 py-12 bg-[#F9FAFB]">
// //       <div className="max-w-6xl mx-auto">
// //         <div className="mb-12 text-center">
// //           <h1 className="mb-3 text-4xl font-bold text-gray-800">Travel Itineraries</h1>
// //           <p className="text-lg text-gray-600">
// //             Explore our curated travel plans and download your perfect itinerary
// //           </p>
// //         </div>

// //         {itineraries.length === 0 ? (
// //           <div className="p-12 text-center bg-white rounded-lg shadow-lg">
// //             <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
// //             <p className="text-xl text-gray-600">No itineraries available yet</p>
// //           </div>
// //         ) : (
// //           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //             {itineraries.map((itinerary) => (
// //               <div
// //                 key={itinerary._id}
// //                 onClick={() => setSelectedItinerary(itinerary)}
// //                 className="cursor-pointer overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2"
// //               >
// //                 <div className="p-6">
// //                   <div className="flex items-start justify-between mb-4">
// //                     <div className="flex items-center">
// //                       <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
// //                       <h2 className="text-2xl font-bold text-gray-800">
// //                         {itinerary.Destination}
// //                       </h2>
// //                     </div>
// //                   </div>

// //                   <div className="flex items-center mb-6 text-gray-600">
// //                     <Calendar className="w-5 h-5 mr-2" />
// //                     <span className="text-sm">
// //                       {itinerary.NoOfDay} {itinerary.NoOfDay === '1' ? 'Day' : 'Days'}
// //                     </span>
// //                   </div>

// //                   <div className="mt-4 text-xs text-center text-gray-500">
// //                     Added on {new Date(itinerary.createdAt).toLocaleDateString()}
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { Download, MapPin, Calendar, FileText, Loader2, ArrowLeft } from 'lucide-react';

// export default function AllItinerary() {
//   const [itineraries, setItineraries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedItinerary, setSelectedItinerary] = useState(null); // for full page detail view

//   useEffect(() => {
//     fetchItineraries();
//   }, []);

//   const fetchItineraries = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/itinerary/');
//       if (!response.ok) throw new Error('Failed to fetch itineraries');
//       const result = await response.json();
//       if (result.success && result.data) {
//         setItineraries(result.data);
//       } else {
//         throw new Error('Invalid data format');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = (url, destination, index) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${destination}_Itinerary_${index + 1}.pdf`;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Show loading or error states as before
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
//           <p className="text-lg text-gray-600">Loading itineraries...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
//         <div className="p-6 bg-white rounded-lg shadow-lg">
//           <div className="flex items-center mb-4 text-red-600">
//             <FileText className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Error Loading Itineraries</h2>
//           </div>
//           <p className="text-gray-600">{error}</p>
//           <button
//             onClick={fetchItineraries}
//             className="px-4 py-2 mt-4 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // If an itinerary is selected, show the full page detail view:
//   if (selectedItinerary) {
//     return (
//       <div className="min-h-screen bg-[#F9FAFB] p-8">
//         <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
//           <button
//             onClick={() => setSelectedItinerary(null)}
//             className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800 font-semibold"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to All Itineraries
//           </button>

//           <div className="flex items-center mb-6 space-x-4">
//             <MapPin className="w-8 h-8 text-indigo-600" />
//             <h1 className="text-3xl font-bold text-gray-800 capitalize">{selectedItinerary.Destination} Itineraries</h1>
//           </div>

//           <p className="mb-8 text-gray-600">
//             Total Days: <span className="font-semibold">{selectedItinerary.NoOfDay} {selectedItinerary.NoOfDay === '1' ? 'Day' : 'Days'}</span>
//           </p>

//           <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//             {selectedItinerary.Upload.map((pdfUrl, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
//               >
//                 <span className="truncate font-medium text-gray-800">{`Itinerary PDF ${idx + 1}`}</span>
//                 <button
//                   onClick={() => handleDownload(pdfUrl, selectedItinerary.Destination, idx)}
//                   className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
//                 >
//                   <Download className="w-5 h-5" />
//                   Download
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 text-sm text-gray-500 text-right">
//             Added on {new Date(selectedItinerary.createdAt).toLocaleDateString()}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Default: show all itinerary cards
//   return (
//     <div className="min-h-screen px-4 py-12 bg-[#F9FAFB]">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-12 text-center">
//           <h1 className="mb-3 text-4xl font-bold text-gray-800 capitalize">Travel Itineraries</h1>
//           <p className="text-lg text-gray-600">
//             Explore our curated travel plans and download your perfect itinerary
//           </p>
//         </div>

//         {itineraries.length === 0 ? (
//           <div className="p-12 text-center bg-white rounded-lg shadow-lg">
//             <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//             <p className="text-xl text-gray-600">No itineraries available yet</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {itineraries.map((itinerary) => (
//               <div
//                 key={itinerary._id}
//                 onClick={() => setSelectedItinerary(itinerary)}
//                 className="cursor-pointer overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2"
//               >
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center">
//                       <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
//                       <h2 className="text-2xl font-bold text-gray-800 capitalize">{itinerary.Destination}</h2>
//                     </div>
//                   </div>

//                   <div className="flex items-center mb-6 text-gray-600">
//                     <Calendar className="w-5 h-5 mr-2" />
//                     <span className="text-sm">
//                       {itinerary.NoOfDay} {itinerary.NoOfDay === '1' ? 'Day' : 'Days'}
//                     </span>
//                   </div>

//                   <div className="mt-4 text-xs text-center text-gray-500">
//                     Added on {new Date(itinerary.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { Download, MapPin, Calendar, FileText, Loader2, X } from 'lucide-react';

// export default function AllItinerary() {
//   const [itineraries, setItineraries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDestination, setSelectedDestination] = useState(null);

//   useEffect(() => {
//     fetchItineraries();
//   }, []);

//   const fetchItineraries = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:4000/itinerary/');
//       if (!response.ok) throw new Error('Failed to fetch itineraries');
//       const result = await response.json();
//       if (result.success && result.data) {
//         setItineraries(result.data);
//       } else {
//         throw new Error('Invalid data format');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Group itineraries by Destination
//   const groupedItineraries = itineraries.reduce((acc, itinerary) => {
//     if (!acc[itinerary.Destination]) {
//       acc[itinerary.Destination] = {
//         Destination: itinerary.Destination,
//         Itineraries: [],
//       };
//     }
//     acc[itinerary.Destination].Itineraries.push(itinerary);
//     return acc;
//   }, {});

//   const handleDownload = (url, destination, index) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${destination}_Itinerary_${index + 1}.pdf`;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
//           <p className="text-lg text-gray-600">Loading itineraries...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
//         <div className="p-6 bg-white rounded-lg shadow-lg">
//           <div className="flex items-center mb-4 text-red-600">
//             <FileText className="w-6 h-6 mr-2" />
//             <h2 className="text-xl font-semibold">Error Loading Itineraries</h2>
//           </div>
//           <p className="text-gray-600">{error}</p>
//           <button
//             onClick={fetchItineraries}
//             className="px-4 py-2 mt-4 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen px-4 py-12 bg-[#F9FAFB]">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-12 text-center">
//           <h1 className="mb-3 text-4xl font-bold text-gray-800">Travel Itineraries</h1>
//           <p className="text-lg text-gray-600">
//             Explore our curated travel plans and download your perfect itinerary
//           </p>
//         </div>

//         {Object.keys(groupedItineraries).length === 0 ? (
//           <div className="p-12 text-center bg-white rounded-lg shadow-lg">
//             <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//             <p className="text-xl text-gray-600">No itineraries available yet</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {Object.values(groupedItineraries).map(({ Destination, Itineraries }) => {
//               // Calculate total days for this destination or pick from the first item (you can customize)
//               const totalDays = Itineraries.reduce((sum, item) => sum + Number(item.NoOfDay), 0);

//               // Earliest added date (optional)
//               const earliestDate = new Date(
//                 Math.min(...Itineraries.map((item) => new Date(item.createdAt)))
//               ).toLocaleDateString();

//               // Combine all PDFs from all itineraries of this destination
//               const allPDFs = Itineraries.flatMap((item) =>
//                 Array.isArray(item.Upload) ? item.Upload : [item.Upload]
//               );

//               return (
//                 <div
//                   key={Destination}
//                   onClick={() => setSelectedDestination({ Destination, PDFs: allPDFs })}
//                   className="cursor-pointer overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2"
//                 >
//                   <div className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center">
//                         <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
//                         <h2 className="text-2xl font-bold text-gray-800">{Destination}</h2>
//                       </div>
//                     </div>

//                     <div className="flex items-center mb-6 text-gray-600">
//                       <Calendar className="w-5 h-5 mr-2" />
//                       <span className="text-sm">
//                         {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
//                       </span>
//                     </div>

//                     <div className="mt-4 text-xs text-center text-gray-500">
//                       Added on {earliestDate}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Modal for showing all PDFs for selected destination */}
//         {selectedDestination && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="relative w-full max-w-lg p-6 bg-white rounded-xl shadow-xl">
//               <button
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//                 onClick={() => setSelectedDestination(null)}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//               <h2 className="mb-4 text-2xl font-bold text-gray-800">
//                 {selectedDestination.Destination} Itineraries
//               </h2>
//               <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
//                 {selectedDestination.PDFs.map((pdfUrl, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
//                   >
//                     <span className="truncate">{`Itinerary PDF ${idx + 1}`}</span>
//                     <button
//                       onClick={() =>
//                         handleDownload(pdfUrl, selectedDestination.Destination, idx)
//                       }
//                       className="flex items-center gap-2 px-3 py-1 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
//                     >
//                       <Download className="w-4 h-4" /> Download
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { MapPin, Calendar, FileText, Loader2, Download } from "lucide-react";

export default function AllItinerary() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null); // selected itinerary to show details

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/itinerary/");
      if (!response.ok) throw new Error("Failed to fetch itineraries");
      const result = await response.json();
      if (result.success && result.data) {
        // Group itineraries by Destination to merge Upload arrays
        const grouped = result.data.reduce((acc, curr) => {
          const found = acc.find((item) => item.Destination === curr.Destination);
          if (found) {
            found.Upload = [...found.Upload, ...curr.Upload];
            found.NoOfDay = Math.max(found.NoOfDay, curr.NoOfDay);
            // Optionally update createdAt to earliest/latest date as needed
          } else {
            acc.push({ ...curr, Upload: [...curr.Upload] });
          }
          return acc;
        }, []);
        setItineraries(grouped);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, destination, index) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${destination}_Itinerary_${index + 1}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
          <p className="text-lg text-gray-600">Loading itineraries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center mb-4 text-red-600">
            <FileText className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Error Loading Itineraries</h2>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchItineraries}
            className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If an itinerary is selected, show its PDFs with Back button
  if (selectedItinerary) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedItinerary(null)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back to Itineraries
        </button>

        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          {selectedItinerary.Destination} Itineraries
        </h1>

        <div className="space-y-4">
          {selectedItinerary.Upload.map((pdfUrl, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-white rounded shadow"
            >
              <span className="truncate font-semibold">{`Itinerary PDF ${idx + 1}`}</span>
              <button
                onClick={() =>
                  handleDownload(pdfUrl, selectedItinerary.Destination, idx)
                }
                className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show list of grouped itineraries
  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-800">Travel Itineraries</h1>
          <p className="text-lg text-gray-600">
            Explore our curated travel plans and download your perfect itinerary
          </p>
        </div>

        {itineraries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-lg shadow-lg">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">No itineraries available yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary._id}
                onClick={() => setSelectedItinerary(itinerary)}
                className="cursor-pointer overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4 space-x-2">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      {itinerary.Destination}
                    </h2>
                  </div>

                  <div className="flex items-center mb-6 text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm">
                      {itinerary.NoOfDay} {itinerary.NoOfDay === 1 ? "Day" : "Days"}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-center text-gray-500">
                    Added on {new Date(itinerary.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
