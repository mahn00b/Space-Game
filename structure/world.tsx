import React, { useEffect, useRef } from 'react'
import player_ship from '../assets/ship.png'
import { editor } from '../utils/editor'

const init = {
  enemies: [],
  level: 0,
  player: null,
  width: 650,
  height: 450,
  grid: null
}

// const colors = ['blue', 'green', 'white', 'purple', 'pink', 'red', 'black']

function World(props: any) {
  const [state, _, merge] = editor({...init, ...props})
  const canvas = useRef(null)
  const player_icon = useRef(null)

  const { width, height, grid, player } = state

  if(!grid) {
    let new_grid = []
    for(let i = 0; i < (height/50); i++) {
        new_grid[i] = []
        for(let j = 0; j < (width/50); j++)
          new_grid[i][j] = new Tile(j, i)
    }

    const player = new Entity(6 * 50, 8 * 50)

    new_grid[8][6].occupy(player)

    merge({ ...state, grid: new_grid, player} )
  }

  const  draw = () => {
    const ctx = canvas.current.getContext("2d")

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const tile = grid[i][j]



        ctx.fillRect(j * 50, i * 50, 50, 50)
        if(tile.occupied)
          ctx.drawImage(player_icon.current, tile.occupied.pos.x, tile.occupied.pos.y , 50, 50)
      }
    }
  }

  // const update = () => {
  //   const ctx = canvas.current.getContext("2d")
  // }

  const move = (e) => {

    if (e.which === 37) {
      player.shift(-1)
      draw()
    }

    if (e.which === 39) {
      player.shift(1)
      draw()
    }
  }

  useEffect(() => {
    draw()
  })

  return (
    <div tabIndex={0} onKeyDown={(e) => move(e)} style={{  }}>
      <canvas ref={canvas} width={width} height={height}  style={{ border: '1px black solid'}}/>
      <img ref={player_icon}  src={player_ship} style={{ display: 'none' }}/>
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

function Entity(x,y, vel = 1) {

  this.image = player_ship
  this.pos = { x, y }
  this.velocity = vel
  this.shift = (mod = 1) => {
    this.pos.x += (this.velocity * mod)
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