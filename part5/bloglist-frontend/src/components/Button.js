const Button = ({ handleClick, text, id }) => (
  <button id={id} type="button" onClick={handleClick}>
    {text}
  </button>
)
export default Button
