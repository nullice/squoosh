import { h, Component } from 'preact';
import { bind, inputFieldChecked, inputFieldValueAsNumber } from '../../lib/util';
import { EncodeOptions, MozJpegColorSpace } from './encoder';

type Props = {
  options: EncodeOptions,
  onChange(newOptions: EncodeOptions): void,
};

export default class MozJPEGEncoderOptions extends Component<Props, {}> {
  @bind
  onChange(event: Event) {
    const form = (event.currentTarget as HTMLInputElement).closest('form') as HTMLFormElement;

    const options: EncodeOptions = {
      // Copy over options the form doesn't currently care about, eg arithmetic
      ...this.props.options,
      // And now stuff from the form:
      // .checked
      baseline: inputFieldChecked(form.baseline),
      progressive: inputFieldChecked(form.progressive),
      optimize_coding: inputFieldChecked(form.optimize_coding),
      trellis_multipass: inputFieldChecked(form.trellis_multipass),
      trellis_opt_zero: inputFieldChecked(form.trellis_opt_zero),
      trellis_opt_table: inputFieldChecked(form.trellis_opt_table),
      // .value
      quality: inputFieldValueAsNumber(form.quality),
      smoothing: inputFieldValueAsNumber(form.smoothing),
      color_space: inputFieldValueAsNumber(form.color_space),
      quant_table: inputFieldValueAsNumber(form.quant_table),
      trellis_loops: inputFieldValueAsNumber(form.trellis_loops),
    };
    this.props.onChange(options);
  }

  render({ options }: Props) {
    // I'm rendering both lossy and lossless forms, as it becomes much easier when
    // gathering the data.
    return (
      <form>
        <label>
          Quality:
          <input
            name="quality"
            type="range"
            min="0"
            max="100"
            value={'' + options.quality}
            onChange={this.onChange}
          />
        </label>
        <label>
          <input
            name="baseline"
            type="checkbox"
            checked={options.baseline}
            onChange={this.onChange}
          />
          Baseline (worse but legacy-compatible)
        </label>
        <label style={{ display: options.baseline ? 'none' : '' }}>
          <input
            name="progressive"
            type="checkbox"
            checked={options.progressive}
            onChange={this.onChange}
          />
          Progressive multi-pass rendering
        </label>
        <label style={{ display: options.baseline ? '' : 'none' }}>
          <input
            name="optimize_coding"
            type="checkbox"
            checked={options.optimize_coding}
            onChange={this.onChange}
          />
          Optimize Huffman table
        </label>
        <label>
          Smoothing:
          <input
            name="smoothing"
            type="range"
            min="0"
            max="100"
            value={'' + options.smoothing}
            onChange={this.onChange}
          />
        </label>
        <label>
          Output color space:
          <select
            name="color_space"
            value={'' + options.color_space}
            onChange={this.onChange}
          >
            <option value={MozJpegColorSpace.GRAYSCALE}>Grayscale</option>
            <option value={MozJpegColorSpace.RGB}>RGB (sub-optimal)</option>
            <option value={MozJpegColorSpace.YCbCr}>YCbCr (optimized for color)</option>
          </select>
        </label>
        <label>
          Quantization table:
          <select
            name="quant_table"
            value={'' + options.quant_table}
            onChange={this.onChange}
          >
            <option value="0">JPEG Annex K</option>
            <option value="1">Flat</option>
            <option value="2">MSSIM-tuned Kodak</option>
            <option value="3">ImageMagick</option>
            <option value="4">PSNR-HVS-M-tuned Kodak</option>
            <option value="5">Klein et al</option>
            <option value="6">Watson et al</option>
            <option value="7">Ahumada et al</option>
            <option value="8">Peterson et al</option>
          </select>
        </label>
        <label>
          <input
            name="trellis_multipass"
            type="checkbox"
            checked={options.trellis_multipass}
            onChange={this.onChange}
          />
          Consider multiple scans during trellis quantization
        </label>
        <label style={{ display: options.trellis_multipass ? '' : 'none' }}>
          <input
            name="trellis_opt_zero"
            type="checkbox"
            checked={options.trellis_opt_zero}
            onChange={this.onChange}
          />
          Optimize runs of zero blocks
        </label>
        <label>
          <input
            name="trellis_opt_table"
            type="checkbox"
            checked={options.trellis_opt_table}
            onChange={this.onChange}
          />
          Optimize after trellis quantization
        </label>
        <label>
          Trellis quantization passes:
          <input
            name="trellis_loops"
            type="range"
            min="1"
            max="50"
            value={'' + options.trellis_loops}
            onChange={this.onChange}
          />
        </label>
      </form>
    );
  }
}
