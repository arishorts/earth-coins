

const Home = () => {   

return ( 
  <article class="min-h-screen min-w-screen">
<div class="bg-gradient-to-r from-green-400 to-green-600">
  <h1 class= "text-3xl font-bold text-brown-200"> EcoCryptoPortal </h1>
  <h2 class="bg-gray-100 bg-opacity-75 p-4 rounded-lg">
  <p class="text-blue-500">
    Welcome to the EcoCryptoPortal! We have filtered Gecko-coins to give you all of the eco-friendly coins 
    on the crypto exchange market. 



    <div class="flex items-center justify-center h-screen">
  <div class="coin">
    <div class="coin-inner">
      <div class="coin-front">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" class="animate-spin-fast">
          <g transform="rotateX(60deg)">
            <circle cx="100" cy="100" r="90" fill="#ccc" stroke="#000" stroke-width="2" />
            <circle cx="100" cy="100" r="60" fill="#fff" />
            <circle cx="100" cy="100" r="40" fill="#0f0" />
            <circle cx="100" cy="100" r="25" fill="#00f" />
          </g>
        </svg>
      </div>
      <div class="coin-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" class="animate-spin-fast">
          <g transform="rotateX(60deg)">
            <circle cx="100" cy="100" r="90" fill="#ccc" stroke="#000" stroke-width="2" />
            <circle cx="100" cy="100" r="60" fill="#fff" />
            <circle cx="100" cy="100" r="40" fill="#0f0" />
            <circle cx="100" cy="100" r="25" fill="#00f" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</div>


  </p>
</h2>
</div>
</article>


)};


export default Home;