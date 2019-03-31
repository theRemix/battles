import * as React from "react";
import { useSpring, animated } from "react-spring";
import styled from "../../styles/styled-components";
import delay from "../../utils/delay";
import useBounds from "../hooks/useBounds";
import { BracketStoreContext } from "./Store";

export interface Props extends React.SVGProps<SVGSVGElement> {
  logo: string;
  name: string;
  dark?: boolean;
  round?: number;
}

const fontSize = 12;

const Name = styled.p`
  font-size: ${fontSize}px;
  text-align: center;
  color: #fff;
`;

const Path = styled(animated.path)`
  fill: none;
  stroke: #ffbb00;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill-opacity: 0;
  filter: url(#glow);
`;

const BackPath = styled.path`
  fill: #1e1f20;
  stroke: #252525;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Contender = React.forwardRef<SVGSVGElement, Props>(
  (props, ref): JSX.Element => {
    const { logo, name, dark, round = 0, ...restProps } = props;
    const { state } = React.useContext(BracketStoreContext);
    const animate = state.animate;
    const [contentBounds, contentRef] = useBounds();
    const width = 120;
    const height = 100;
    const contentOffset = height / 2 + 20;

    const pathDefinition = [
      `M 0 50`,
      `v -50`,
      `h 120`,
      `v 100`,
      `h -120`,
      `v -50`,
    ].join(" ");

    const pathLength = 500;
    const pathSpring: any = useSpring({
      from: { x: 0, opacity: 1 },
      to: async (next: any) => {
        await delay((round - 1) * 4000 + 2150);
        await next({ x: pathLength });
        await next({ opacity: 0 });
      },
      config: {
        duration: 1000,
        easing: (t: number) => --t * t * t + 1,
      },
    });

    return (
      <svg
        width={width}
        height={height + contentBounds.height - fontSize}
        ref={ref}
        {...restProps}
      >
        <rect width={width} height={height} fill={dark ? "#333" : "#fff"} />
        <rect
          width={width}
          height={height + contentBounds.height - contentOffset - fontSize}
          y={contentOffset}
          fill="#333"
        />
        <image
          x="10"
          y="10"
          width={width - 20}
          height={height / 2}
          xlinkHref={logo}
        />
        <foreignObject
          x="10"
          y={contentOffset + 10}
          width={width - 20}
          height={contentBounds.height}
        >
          <Name ref={contentRef}>{name}</Name>
        </foreignObject>
        {animate && round > 0 && (
          <animated.g opacity={pathSpring.opacity} pointerEvents="none">
            <BackPath d={pathDefinition} />
            <Path
              d={pathDefinition}
              strokeDasharray={pathLength}
              strokeDashoffset={pathSpring.x.interpolate(
                (x: number) => pathLength - x,
              )}
            />
          </animated.g>
        )}
      </svg>
    );
  },
);

Contender.displayName = "Contender";

export default Contender;
