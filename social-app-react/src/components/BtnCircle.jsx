
const BtnCircle = (props) => {

  let _handleClick = () => { }; // ako je diabled
  if (!props.disabled) {
    // ako niej disabled onda se desava handleClick koji smo poslali kao props
    _handleClick = props.handleClick;
  }

  return (
    <abbr title={props.tip}>
      <div
        className={props.disabled ? "btn-circle disabled" : "btn-circle"}
        onClick={_handleClick}
      >
        <i className={props.fa} aria-hidden="true"></i>
      </div>
    </abbr>
  )

};

export default BtnCircle;