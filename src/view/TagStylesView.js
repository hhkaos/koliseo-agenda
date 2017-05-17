import { h, render, Component } from 'preact';
import { dasherize } from '../util';

const bgColors = [
  '#008cba', '#e65100', '#00796b', '#d00b18', '#388e3c', '#e81260', '#c15711', '#642dad', '#212121'
];
const borderColors = [
  '#00698c', '#ad3d00', '#005b50', '#9c0812', '#2a6b2d', '#ae0e48', '#91410d', '#4b2282', '#191919'
];

/**
 * Generate the styles for each tag category
 * tagCategories: { JSON of tagCategoryName, values }
 */
export default function({ tagCategories }) {
  const styles = Object.keys(tagCategories).map((category, index) => {
    return `.tag-${dasherize(category)} {background-color:${bgColors[index]};border-color:${borderColors[index]};}` 
  })
  return (
    <style>
      {styles}
    </style>
  )


}