import React from 'react';
/* eslint react/prop-types: 0 */
import './SliderNavigation.Styles.scss';

const SliderNavigation = props => {
  const dots = [];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    const stepCompleted = props.currentStep > i;
    dots.push(
      <span
        key={`step-${i}`}
        className={`sliderNavigationDot ${isActive ? 'sliderNavigationActive' : ''} ${
          stepCompleted ? 'sliderNavigationCompleted' : ''
        } `}
        onClick={() => props.goToStep(i)}
      >
        {i}
      </span>
    );
  }

  return <div className="sliderNavigation">{dots}</div>;
};

export default SliderNavigation;
