import React, { useEffect, useRef } from 'react'
import player_ship from '../assets/ship.png'
import lazer from '../assets/lazer.png'
import { editor } from '../utils/editor'



const init = {
  enemies: [],
  level: 0,
  player: null,
  width: 650,
  height: 450,
  unit: 50,
  grid: null
}

function World(props: any) {
  const [state, _, merge] = editor({...init, ...props})
  const canvas = useRef(null)
  const player_icon = useRef(null)
  const lazer_shot = useRef(null)

  const { width, unit, height, grid, player } = state

  if(!grid) {
    let new_grid = []
    for(let i = 0; i < (height/unit); i++) {
        new_grid[i] = []
        for(let j = 0; j < (width/unit); j++)
          new_grid[i][j] = new Tile(j, i)
    }

    const player = new Entity(6 * unit, 8 * unit, 10, player_icon)

    new_grid[8][6].occupy(player)

    merge({ ...state, grid: new_grid, player} )
  }

  const  draw = () => {
    const ctx = canvas.current.getContext("2d")

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const tile = grid[i][j]

        if(tile.occupied)
          ctx.drawImage(tile.occupied.image.current, tile.occupied.pos.x, tile.occupied.pos.y , unit, unit)
      }
    }
  }

  const get_tile = (x, y) => {
    return grid[Math.ceil(y / unit)][Math.ceil(x / unit)]
  }

  const get_index = (x, y) => {
    return { x: Math.ceil(x / unit), y: Math.ceil(y / unit) }
  }

  const move = (e) => {
    const { x: old_x, y: old_y } = player.pos

    if (e.which === 37 && player.pos.x > 0) {
        player.shift(-1)
    }

    if (e.which === 39 && player.pos.x < (width - unit)) {
      player.shift(1)
    }

    const { x, y } = player.pos

    const new_tile = get_index(x, y), old_tile = get_index(old_x, old_y)

    if(new_tile.x !== old_tile.x || new_tile.y !== old_tile.y) {
      grid[old_tile.y][old_tile.x].vacate()
      grid[new_tile.y][new_tile.x].occupy(player)
    }

    draw()

    if (e.which === 32) {

      const shot = new Entity(x + (unit/3), y - unit, 10, lazer_shot)

      const tile = get_tile(x, y - unit)
      tile.occupy(shot)

      const updater = () => {
        const { x, y } = shot.pos



        if (y > (0-unit)) {
          const { x: old_x, y: old_y } = shot.pos
          shot.shifty(-1)
          const { x, y } = shot.pos
          const new_tile = get_index(x, y), old_tile = get_index(old_x, old_y)

          if (new_tile.x !== old_tile.x || new_tile.y !== old_tile.y) {
          /* This is definitely where we need to create the collision logic */


            grid[old_tile.y][old_tile.x].vacate()

            if(shot.y >= 0 && shot.y <= (height / unit))
              grid[new_tile.y][new_tile.x].occupy(shot)


            console.log(`old: x:${old_tile.x} y:${old_tile.y}`)
            console.log(`new: x:${new_tile.x} y:${new_tile.y}`)
          }


          draw()

          setTimeout(updater, 1000)
        } else {
          tile.vacate()
        }
      }

      setTimeout(updater, 1000)
    }

  }

  useEffect(() => {
    draw()
  })

  return (
    <div tabIndex={0} onKeyDown={(e) => move(e)} style={{  }}>
      <canvas ref={canvas} width={width} height={height}  style={{ border: '1px black solid'}}/>
      <img ref={player_icon}  src={player_ship} style={{ display: 'none' }}/>
      <img ref={lazer_shot} src={lazer} style={{ display: 'none', width: '200px', height: '200px' }} />
    </div>
  )
}

interface Position {
  x: number
  y: number
}

interface Entity {
  health: number
  pos: Position
  image: any
}

function Entity(x,y, vel = 20, src: any) {

  this.image = src
  this.pos = { x, y }
  this.velocity = vel
  this.shift = (mod = 1) => {
    this.pos.x += (this.velocity * mod)
  }

  this.shifty = (mod = 1) => {
    this.pos.y += (this.velocity * mod)
  }
}

interface Tile {
  pos: Position
}

const Tile = function (x,y) {
  this.pos = {x, y}
  this.occupied = false

  this.occupy = (item: any) => this.occupied = item

  this.vacate = () => this.occupied = false
}

export default World