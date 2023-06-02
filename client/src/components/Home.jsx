import { Box, Text, Button, Image } from "@chakra-ui/react"




const Home = () => {    
<Box
  w='100%'
  h='200px'
  bgGradient='linear(to-r, green.100, green.600, green.100)'
>
<Box
        bg="white"
        rounded="full"
        overflow="hidden"
        position="relative"
        boxSize="100%"
      >
        <Image src="/coin-image.jpg" alt="Coin Image" boxSize="100%" objectFit="cover" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="engraved-pattern"
              patternUnits="userSpaceOnUse"
              width="100%"
              height="100%"
            >
              <image xlinkHref="/earth-engraved.jpg" width="200" height="200" />
            </pattern>
          </defs>
          <circle cx="100" cy="100" r="85" fill="url(#engraved-pattern)" />
        </svg>
      </Box>
    <Text fontSize="x3" size="2x1" color= "brown" mb={7}> Earth-Coins </Text>
    <Text fontSize="x1" size="1x1" color= "blue" mb={4}> A dashboard that filters gecko-coin for eco-friendly cryptocurrencies. </Text>  
    <Button 
    colorScheme="whiteAlpha" 
    size="lg"
    padding="2px 4px"
    borderWidth= "3px"
    borderColor="green"
    > 
        Login
    </Button>
    <Button 
    colorScheme="whiteSmoke" 
    size="lg"
    padding="2px 4px"
    borderWidth="2px"
    borderColor="green">
        Sign-Up
    </Button>
    </Box>

};


export default Home;