"use client";
import dynamic from "next/dynamic";
const KanbanBoard = dynamic(() => import("./child/KanbanBoard"), { ssr: false });

const KanbanLayer = () => {
  return (
    <div className='overflow-x-auto scroll-sm pb-8'>
      <KanbanBoard />
    </div>
  );
};

export default KanbanLayer;
