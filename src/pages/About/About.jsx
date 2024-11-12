import "./about.css";
function About() {
  return (
    <div className="aboutPage">
      <div className="text">
        <div className="welcomeBox">
          <h4>SWASTHYA BOOKING</h4>
          <h1>Welcome!</h1>
        </div>
        <div className="actualText">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            necessitatibus, expedita quod voluptate earum dignissimos nihil
            pariatur neque, ab quam tempora odit alias unde soluta, explicabo
            sequi. ducimus, et. rerum?
          </p>
        </div>
        <div className="readmoreBtn">
          <button>READ MORE</button>
        </div>
      </div>
      <div className="image">
        <img src="/public/ladyDoctor.jpg" alt="" />
      </div>
    </div>
  );
}

export default About;
