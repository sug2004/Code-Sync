import { BrowserRouter,Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import Home from "./assets/Pages/Home.jsx"
import EditorPage from "./assets/Pages/EditorPage.jsx"
export default function App() {
  return (
    <>
    <div>
      <Toaster 
      position="top-right"
      toastOptions={{
        success:{
          theme:{
            primary:'#4dff4d'
          }
        }
      }}
      >
      </Toaster>
    </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/editor/:roomId" element={<EditorPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}