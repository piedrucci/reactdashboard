
var utils =
{
  generateRGBA() {
    const color1 = Math.trunc( Math.random() * (255 - 0) + 0 )
    const color2 = Math.trunc( Math.random() * (255 - 0) + 0 )
    const color3 = Math.trunc( Math.random() * (255 - 0) + 0 )

    return [color1, color2, color3]
  }
}

export default utils
