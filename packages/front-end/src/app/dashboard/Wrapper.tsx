import dynamic from "next/dynamic";

const GraphWrapper = dynamic(() => import("./Graph"), {
  ssr: false
});

export default GraphWrapper;
