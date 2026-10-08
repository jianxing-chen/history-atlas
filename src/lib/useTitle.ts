import { useEffect } from "react";

/** 设置当前页面的 document.title */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
