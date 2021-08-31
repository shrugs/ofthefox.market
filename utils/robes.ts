import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import type { OpenseaResponse, Asset } from './openseaTypes'
import RobeIDs from '../data/robes-ids.json'

const chunked = chunk(RobeIDs, 20)
const apiKey = process.env.OPENSEA_API_KEY

const fetchRobePage = async (ids: string[]) => {
  let url = 'https://api.opensea.io/api/v1/assets?collection=lootproject&'
  url += ids.map((id) => `token_ids=${id}`).join('&')

  const res = await fetch(url, {
    // headers: {
    //   'X-API-KEY': apiKey,
    // },
  })
  const json: OpenseaResponse = await res.json()
  return json.assets
}

export interface RobeInfo {
  id: string
  price: Number
  url: string
  svg: string
}

export const fetchRobes = async () => {
  const data = await pMap(chunked, fetchRobePage, { concurrency: 2 })
  const mapped = flatten(data)
    .filter((d) => {
      return (
        d.sell_orders &&
        d.sell_orders.length > 0 &&
        d.sell_orders[0].payment_token_contract.symbol == 'ETH'
      )
    })
    .map((a: Asset): RobeInfo => {
      return {
        id: a.token_id,
        price: Number(
          etherUtils.formatUnits(
            BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
          ),
        ),
        url: a.permalink + '?ref=0xEC6d36A487d85CF562B7b8464CE8dc60637362AC',
        svg: a.image_url,
      }
    })
  return orderBy(mapped, ['price', 'id'], ['asc', 'asc'])
}
