import { useState, ReactNode, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface CarouselProps {
  children: ReactNode[];
  interval?: number; 
}

function Carousel({ children, interval = 3000 }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex(activeIndex === 0 ? children.length - 1 : activeIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(activeIndex === children.length - 1 ? 0 : activeIndex + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(activeIndex === children.length - 1 ? 0 : activeIndex + 1);
    }, interval);

    return () => clearInterval(intervalId);
  }, [activeIndex, children.length, interval]);

  return (
    <div id="opps" className="carousel slide" data-ride="carousel">
      <ul className="carousel-indicators">
        {children.map((_, index) => (
          <li
            key={index}
            data-target="#opps"
            data-slide-to={index}
            className={index === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            {index === activeIndex ? (
              <FontAwesomeIcon icon={faDotCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </li>
        ))}
      </ul>
      <div className="carousel-inner">
        {children.map((child, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
          >
            {child}
          </div>
        ))}
      </div>
      <a className="carousel-control-prev carousel-control-icon" href="#opps" role="button" data-slide="prev" onClick={handlePrev}>
        <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>
      </a>
      <a className="carousel-control-next carousel-control-icon" href="#opps" role="button" data-slide="next" onClick={handleNext}>
        <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
      </a>
    </div>
  );
}

export default Carousel;
