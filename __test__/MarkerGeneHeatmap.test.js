import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import MarkerGeneHeatmap from '../src/MarkerGeneHeatmap'

Enzyme.configure({ adapter: new Adapter() })

describe(`MarkerGeneHeatmap`, () => {
  test(`creates plotlines for every cluster if data isn't filtered`, () => {
    const wrapper = shallow(<MarkerGeneHeatmap
      data={[
        {
          x: 0,
          y: 0,
          name: `foo`,
          value: 13,
          clusterIdWhereMarker: 1
        },
        {
          x: 1,
          y: 1,
          name: `bar`,
          value: 2,
          clusterIdWhereMarker: 2
        },
        {
          x: 2,
          y: 2,
          name: `foobar`,
          value: 1,
          clusterIdWhereMarker: 3
        }
      ]}
      xAxisCategories={[`1`, `2`, `3`]}
      yAxisCategories={[`a`, `b`, `c`]}
      chartHeight={200}
      isDataFiltered={false}
      heatmapRowHeight={20}
      hasDynamicHeight={false} />)

    const chartOptions = wrapper.find('t').props().options

    expect(chartOptions.yAxis[0].plotLines).toHaveLength(3)
  })

  test(`doesn't create plotlines if data is filtered`, () => {
    const wrapper = shallow(<MarkerGeneHeatmap
      data={[
        {
          x: 0,
          y: 0,
          name: `foo`,
          value: 13,
          clusterIdWhereMarker: 1
        }
      ]}
      xAxisCategories={[`1`, `2`, `3`]}
      yAxisCategories={[`a`, `b`, `c`]}
      chartHeight={200}
      isDataFiltered={true}
      heatmapRowHeight={20}
      hasDynamicHeight={false} />)

    const chartOptions = wrapper.find('t').props().options

    expect(chartOptions.yAxis[0].plotLines).toHaveLength(0)
  })
})