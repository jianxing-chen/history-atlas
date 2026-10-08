/** 手盖印章：茜红方印 + 「史」字，整站的品牌记号 */
export function Seal({ size = 26 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[4px] border border-[#8f3d33]"
      style={{
        width: size,
        height: size,
        background: "#b4574a",
        transform: "rotate(-2deg)",
        boxShadow: "inset 0 0 0 1.5px rgba(247,243,233,0.35)",
      }}
      aria-hidden
    >
      <span
        className="font-serif-cjk font-semibold leading-none text-[#f7f3e9]"
        style={{ fontSize: size * 0.62 }}
      >
        史
      </span>
    </span>
  );
}
