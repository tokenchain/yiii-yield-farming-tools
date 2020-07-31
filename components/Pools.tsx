import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Collapse,
  Text,
  Flex,
  IconButton,
  Heading,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/core'
import getPoolData from '../utils/pool-data'
import { Card } from '../components/Card'
import { initEthers } from '../utils/utils'

type PoolData = {
  icon?: string
  name: string
  provider: string
  poolItems: Array<String>
  poolRewards: Array<String>
  getPoolData: Function
}

const poolDataList: Array<PoolData> = [
  {
    provider: 'Synthetix',
    name: 'Curve sUSD',
    poolItems: [''],
    poolRewards: ['SNX', 'CRV'],
    getPoolData: getPoolData.susd,
  },
  // {
  //   provider: 'Synthetix',
  //   name: 'Synthetix iETH',
  //   poolItems: [''],
  //   poolRewards: ['SNX'],
  //   getPoolData: getPoolData.ieth,
  // },
  {
    provider: 'Synthetix',
    name: 'Synthetix iBTC',
    poolItems: [''],
    poolRewards: ['SNX'],
    getPoolData: getPoolData.ibtc,
  },
  {
    provider: 'Synthetix & Ren',
    name: 'Curve sBTC',
    poolItems: [''],
    poolRewards: ['SNX', 'CRV', 'REN', 'BAL'],
    getPoolData: getPoolData.sbtc,
  },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Curve yCRV',
  //   poolItems: [''],
  //   poolRewards: ['YFI', 'CRV'],
  //   getPoolData: getPoolData.ygov_ycrv,
  // },
  // {
  //   provider: 'yearn.finance',
  //   name: 'Balancer YFI-DAI',
  //   poolItems: [''],
  //   poolRewards: ['YFI', 'BAL'],
  //   getPoolData: getPoolData.ygov_balancer,
  // },
  {
    provider: 'yearn.finance',
    name: 'Balancer YFI-yCRV',
    poolItems: [''],
    poolRewards: ['YFI', 'CRV', 'BAL', 'yCRV'],
    getPoolData: getPoolData.ygov_ycrv_balancer,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-USDC',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_usdc,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-WETH',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_weth,
  },
  {
    provider: 'mStable',
    name: 'Balancer mUSD-MTA',
    poolItems: [''],
    poolRewards: ['MTA', 'BAL'],
    getPoolData: getPoolData.musd_mta,
  },
  {
    provider: 'UMA Project',
    name: 'Balancer yUSD-USDC',
    poolItems: [''],
    poolRewards: ['UMA', 'BAL'],
    getPoolData: getPoolData.yusd_usdc,
  },
  {
    provider: 'yfii.finance',
    name: 'Curve yCRV',
    poolItems: [''],
    poolRewards: ['YFII', 'CRV'],
    getPoolData: getPoolData.yfii_ycrv,
  },
  {
    provider: 'yfii.finance',
    name: 'Balancer YFII-DAI',
    poolItems: [''],
    poolRewards: ['YFII', 'BAL'],
    getPoolData: getPoolData.yfii_dai,
  },
]

export const PoolSection = (props) => {
  const [ethApp, setEthApp] = useState(null)
  const [appError, setAppError] = useState(false)

  const connectToWallet = async () => {
    try {
      const app = await initEthers()
      setEthApp(app)
    } catch (e) {
      console.error(e)
      setAppError(true)
    }
  }

  useEffect(() => {
    connectToWallet()
  }, [])

  return ethApp ? (
    <Box pt={4}>
      {/* <Heading mx="1rem" pb={5}>
        Pools
      </Heading> */}

      <Box>
        <Flex justifyContent="space-between" mx="1rem">
          <Text
            w="25%"
            d={{ xs: 'none', md: 'block' }}
            color="gray.600"
            fontWeight="bold"
            ml="16px"
          >
            Provider
          </Text>
          <Text ml="16px" w="25%" color="gray.600" fontWeight="bold">
            Pool
          </Text>
          <Text w="25%" color="gray.600" fontWeight="bold">
            Rewards
          </Text>
          <Text w="30%" color="gray.600" fontWeight="bold">
            APR
          </Text>
          <Text> </Text>
        </Flex>
        <Box mx="1rem">
          {poolDataList.map((poolItemData) => (
            <PoolItem
              key={poolItemData.name}
              poolItemData={poolItemData}
              app={ethApp}
            />
          ))}
        </Box>
      </Box>
    </Box>
  ) : (
    <Card
      maxW={{ xs: '100%', lg: 400 }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {appError && (
        <Alert status="error" maxW={400} mb={3}>
          <AlertIcon />
          <AlertTitle mr={2}>Web3 compatible browser required!</AlertTitle>
        </Alert>
      )}
      <Text fontWeight="bold" pb={3}>
        Connect your wallet to view pools
      </Text>
      <Button onClick={connectToWallet} variantColor="teal">
        Connect Wallet
      </Button>
    </Card>
  )
}

const PoolItem = ({ poolItemData, app }) => {
  const { provider, name, poolItems, poolRewards, getPoolData } = poolItemData
  const [show, setShow] = useState(false)
  const [apr, setApr] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (app) {
        const poolData = await getPoolData(app)
        setApr(poolData.apr)
      }
    })()
  }, [app])

  return (
    <Card boxShadow="sm" mx={0}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text d={{ xs: 'none', md: 'block' }} w="25%">
          {provider}
        </Text>
        <Text w="25%">{name}</Text>
        <Box w="25%">
          {poolRewards.map((reward) => (
            <Badge mx={1} key={reward}>
              {reward}
            </Badge>
          ))}
        </Box>
        <Text w="25%">{apr ? `${apr}%` : <Spinner />}</Text>
        <IconButton
          visibility="hidden"
          backgroundColor="white"
          fontSize={20}
          onClick={() => setShow(!show)}
          isRound={true}
          aria-label="Show more"
          icon={show ? 'chevron-up' : 'chevron-down'}
        >
          More Info
        </IconButton>
      </Flex>
      <Collapse mt={4} isOpen={show}>
        {/* Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus
        terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer
        labore wes anderson cred nesciunt sapiente ea proident. */}
      </Collapse>
    </Card>
  )
}