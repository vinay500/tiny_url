import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// export default function RedirectHandler() {
//   const { code } = useParams();

// //   useEffect(() => {
// //     if (!code) return;

// //     const handleRedirect = async () => {
// //       try {
// //         // Call backend redirect API
// //         const response = await fetch(`${API_BASE_URL}/${code}`, {
// //           redirect: "manual", // we handle the redirect manually
// //         });

// //         // If backend returned JSON error instead of redirect
// //         if (response.status !== 302) {
// //           toast.error("Invalid or expired short link");
// //           return;
// //         }
// //       } catch (err) {
// //         toast.error("Invalid or expired short link");
// //       }
// //     };

// //     handleRedirect();
// //   }, [code]);

// //   return (
// //     <div className="p-10 text-center">
// //       <p>Redirecting...</p>
// //     </div>
// //   );


//     useEffect(() => {
//         if (!code) return;

//         // Redirect to backend redirect API
//         const shortUrl = `${API_BASE_URL}/${code}`;

//         // Replace current SPA route with the backend redirect route
//         window.location.replace(shortUrl);
//     }, [code]);

//     return (
//         <div className="flex items-center justify-center h-screen text-lg">
//         Redirecting...
//         </div>
//     );
// }


export default function RedirectHandler() {
    const { code } = useParams();
    const [error, setError] = useState("");
  
    useEffect(() => {
      if (!code) return;
  
      const verifyAndRedirect = async () => {
        try {
          // Step 1: Hit stats endpoint first
          const res = await fetch(`${API_BASE_URL}/api/links/${code}`);
  
          if (res.status === 404) {
            setError("This short link does not exist.");
            return;
          }
  
          if (!res.ok) {
            setError("Failed to verify this short link.");
            return;
          }
  
          // Step 2: Now redirect
          window.location.replace(`${API_BASE_URL}/${code}`);
  
        } catch (err) {
          setError("Something went wrong while redirecting.");
        }
      };
  
      verifyAndRedirect();
    }, [code]);
  
    if (error) {
      return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">404 - Invalid Short Link</h1>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
            <Footer />
        </>
      );
    }
  
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Redirecting...
      </div>
    );
  }
