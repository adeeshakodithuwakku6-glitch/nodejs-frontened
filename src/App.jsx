import ProductCard from './components/productCard'
import './App.css'
import { FaHome } from "react-icons/fa";

function App() {

  return (
    <div>
      <ProductCard name="Apple Laptop" price="600" image="https://picsum.photos/id/1/200/300"></ProductCard>
      <ProductCard name="Samsung Galaxy S21" price="800" image="https://picsum.photos/id/2/200/300"></ProductCard>
      <ProductCard name="Google Pixel 6" price="700" image="https://picsum.photos/id/3/200/300"></ProductCard>
      <FaHome className="text-[100px] text-green-700"/>
    </div>
  )
}

export default App
