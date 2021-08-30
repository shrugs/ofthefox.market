import { format as ts } from 'timeago.js'
import { fetchRobes, RobeInfo } from '../utils/robes'

interface Props {
  robes: RobeInfo[]
  lastUpdate: string
}

const Robe = ({ robe }: { robe: RobeInfo }) => {
  return (
    <a href={robe.url} target="_blank">
      <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
        <img src={robe.svg} />
        <div className="text-center">
          <p className="text-lg">#{robe.id}</p>
          <p>{robe.price} ETH</p>
        </div>
      </div>
    </a>
  )
}

const IndexPage = ({ robes, lastUpdate }: Props) => {
  return (
    <div className="py-3 md:pb-0 font-mono flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
      <h1 className="text-lg md:text-3xl">Katanas</h1>
      <div className="text-center max-w-screen-md md:leading-loose">
        <p className="md:text-xl">
          There are {robes.length} bags for sale with Katanas. The floor
          price is {robes[0].price} ETH.
        </p>
        <p className="md:text-lg pt-2">
          Original <a target="_blank" href="robes.market" className="underline">robes.market</a> by{' '}
          <a
            target="_blank"
            href="https://twitter.com/worm_emoji"
            className="underline"
          >
            worm_emoji
          </a>
          . weeb.market by{' '}
          <a
            target="_blank"
            href="https://twitter.com/1ofthemanymatts"
            className="underline"
          >
            one of the many matts
          </a>
          .
        </p>
        <p className="text-sm mv-4">Last updated {ts(lastUpdate)}</p>
      </div>
      <div className="grid md:grid-cols-2 pt-5">
        {robes.map((robe) => {
          return <Robe robe={robe} key={robe.id} />
        })}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const robes = await fetchRobes();

  return {
    props: {
      robes,
      lastUpdate: new Date().toISOString(),
    },
    revalidate: 300,
  }
}

export default IndexPage
