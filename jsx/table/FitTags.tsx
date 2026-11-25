import React, {ReactElement, useLayoutEffect, useRef, useState} from 'react';

/**
 * A row of tags on one line: the tags that fit show, and a count stands for
 * the rest.
 *
 * @param props - React props
 * @param props.children - the tags, each with its own key
 * @param props.className - more classes for the row
 */
function FitTags(props: {children: ReactElement[], className?: string}) {
  const count = props.children.length;
  const ref = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState(count);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    /**
     * Counts the tags that fit beside the count of the rest
     */
    const measure = () => {
      // A tag's own width, before it shortens to fit
      const widths = (Array.from(el.children).filter(
        (c) => !c.classList.contains('rt-tags-more')
      ) as HTMLElement[]).map(
        (t) => t.scrollWidth + t.offsetWidth - t.clientWidth
      );
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const more = el.querySelector<HTMLElement>('.rt-tags-more');
      const total = widths.reduce((sum, w) => sum + w + gap, -gap);
      if (total <= el.clientWidth) {
        setFit(count);
        return;
      }
      const room = el.clientWidth - (more?.offsetWidth ?? 24) - gap;
      let used = 0;
      let n = 0;
      while (n < widths.length && used + widths[n] <= room) {
        used += widths[n] + gap;
        n++;
      }
      setFit(Math.max(1, n));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, fit]);

  return (
    <span
      className={'rt-tags rt-tags-fit'
        + (props.className ? ' ' + props.className : '')}
      ref={ref}
    >
      {props.children.map((tag, i) => i < fit ? tag : (
        <span key={tag.key} className="rt-tag-hidden" aria-hidden="true">
          {tag}
        </span>
      ))}
      {fit < count && <span className="rt-tags-more">+{count - fit}</span>}
    </span>
  );
}

export default FitTags;
