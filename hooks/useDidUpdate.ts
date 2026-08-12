import { DependencyList, EffectCallback, useEffect, useRef } from "react";

export default function useDidUpdate(
  effect: EffectCallback,
  deps?: DependencyList
) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    return effect();
  }, deps);
}