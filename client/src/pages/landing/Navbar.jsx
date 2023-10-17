import { Link } from "react-router-dom"
import logo from "../../assets/icons/dark/save-2.svg"
import { useTheme } from "hooks/useTheme"
import { useDispatch, useSelector } from "react-redux"
import { setSettings } from "state"
import useToggleTheme from "pages/landing/ToggleTheme"
import ToggleTheme from "pages/landing/ToggleTheme"
const Navbar=()=>{
  const theme=useTheme()
  return(
    <div className="shadow-lg py-2" style={{backgroundColor:theme.background[100]}}>
      <ToggleTheme/>
      <div className="container m-auto py-2 flex gap-3 items-center ">
        <Link className="flex items-center gap-3" to="/">
          <img src={logo} alt="Socially" srcset="" />
          <h1 className=" font-mono">Socailly</h1>
        </Link>
      </div>
    </div>
  )
}
export default Navbar