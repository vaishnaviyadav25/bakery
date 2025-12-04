"use client"; // 👈 Add this line at the very top

import { Suspense } from "react";
import Orderpage from "@/components/Orderpage";
import Footerpage from "@/components/Footerpage";


export default function Order() {
  return (
    <main>
      {/* Suspense ensures client-only hooks don’t crash prerender */}
      <Suspense fallback={<div className="text-center py-20">Loading order...</div>}>
        <Orderpage />
      </Suspense>

      <Footerpage />
    </main>
  );
}
