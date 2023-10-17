import { useDispatch, useSelector } from "react-redux"
import { setSettings } from "state"
import moon from "../../assets/icons/fontawesome/moon.svg"
const ToggleTheme=()=>{
  const mode=useSelector((state)=>state.settings).mode
  const dispatch= useDispatch()
  return( 
  <button onClick={()=>{
    mode==="dark"?
    dispatch(setSettings({property:"mode",value:"light"})):
    dispatch(setSettings({property:"mode",value:"dark"}))

  }}>
    <img src={moon} alt="" srcset="" />
  </button>)
}
export default ToggleTheme