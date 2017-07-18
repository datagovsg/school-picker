import SgHeatmap from 'sg-heatmap/dist/predefined/URA_planning_area_mp14'
import {Feature} from 'sg-heatmap'
import _min from 'lodash/min'
import _max from 'lodash/max'
import _remove from 'lodash/remove'

import turfUnion from '@turf/union'
import turfBuffer from '@turf/buffer'

export class CustomHeatmap extends SgHeatmap {
  constructor () {
    super()

    const features = this.children
      .filter(feature => feature.properties.Central_Area_Indicator === 'Y')
      .map(feature => feature.id)

    function postProcess (mergedFeature, removed, heatmap) {
      const representative = removed.find(feature => feature.id === 'MU')
      const mergedNeighbours = removed.reduce((neighbours, feature) => {
        feature.properties.neighbours.forEach(neighbour => {
          if (neighbours.indexOf(neighbour) > -1) return
          neighbours.push(neighbour)
        })
        return neighbours
      }, [])

      mergedFeature.properties = {
        Planning_Area_Name: 'CENTRAL AREA',
        Planning_Area_Code: 'CA',
        X_ADDR: representative.properties.X_ADDR,
        Y_ADDR: representative.properties.Y_ADDR,
        Address: representative.properties.Address,
        neighbours: mergedNeighbours
      }

      removed = removed.map(feature => feature.id)

      heatmap.children.forEach(c => {
        if (c.properties.neighbours.some(neighbour => removed.indexOf(neighbour) > -1)) {
          if (c.id !== 'CA') c.properties.neighbours.push('CA')
          c.properties.neighbours = c.properties.neighbours
            .filter(neighbour => features.indexOf(neighbour) === -1)
        }
      })
    }

    mergeFeatures(this, features, 'CA', postProcess)
  }
}

export function mergeFeatures (heatmap, features, id, postProcess) {
  const filtered = heatmap.children.filter(c => features.indexOf(c.id) > -1)

  const buffered = filtered.map(feature => turfBuffer(feature, 0.001, 'kilometers'))
  const geometry = turfBuffer(turfUnion(...buffered), -0.001, 'kilometers').geometry
  geometry.bbox = [
    _min(filtered.map(feature => feature.geometry.bbox[0])),
    _min(filtered.map(feature => feature.geometry.bbox[1])),
    _max(filtered.map(feature => feature.geometry.bbox[2])),
    _max(filtered.map(feature => feature.geometry.bbox[3]))
  ]

  const mergedFeature = new Feature({
    type: 'Feature',
    geometry,
    id
  })
  heatmap.children.push(mergedFeature)
  _remove(heatmap.children, c => features.indexOf(c.id) > -1)
  if (postProcess) {
    postProcess(mergedFeature, filtered, heatmap)
  }
}
