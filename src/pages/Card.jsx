function Card({ children, title }) {
    return (
      <div className="custom-card">
        <div className="title">{title}</div>
        {children}
      </div>
    );
  }
  
  export default Card;