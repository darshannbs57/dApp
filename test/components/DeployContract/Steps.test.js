import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, Form, Input, InputNumber, Button } from 'antd';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  NameContractStep,
  PricingStep,
  ExpirationStep,
  DataSourceStep,
  DeployStep
} from '../../../src/components/DeployContract/Steps';

describe('NameContractStep', () => {
  let nameContractStep;
  beforeEach(() => {
    nameContractStep = mount(<NameContractStep />);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NameContractStep />, div);
  });

  it('should display two input felds to accept name and base token address', () => {
    expect(nameContractStep.find(Input)).to.have.length(2);
  });

  it('should have a next button', () => {
    expect(nameContractStep.find(Button)).to.have.length(1);
  });
});

describe('PricingStep', () => {
  let pricingStep;
  beforeEach(() => {
    pricingStep = mount(<PricingStep />);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PricingStep />, div);
  });

  it('should display four inputs felds to accept price cap, price floor, multiplier & decimal address', () => {
    expect(pricingStep.find(InputNumber)).to.have.length(4);
  });

  it('should have two buttons to navigate back and forward', () => {
    expect(pricingStep.find(Button)).to.have.length(2);
  });
});

describe('ExpirationStep', () => {
  let updateDeploymentStateSpy;
  let onNextClickedSpy;
  let expirationStep;

  beforeEach(() => {
    updateDeploymentStateSpy = sinon.spy();
    onNextClickedSpy = sinon.spy();
    expirationStep = mount(<ExpirationStep
      updateDeploymentState={updateDeploymentStateSpy}
      onNextClicked={onNextClickedSpy} />);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ExpirationStep />, div);
  });

  it('should updateDeploymentState on submit', () => {
    expirationStep.setProps({
      expirationTimeStamp: 1234567,
      form: {
        validateFields(cb) {
          cb(null, {});
        },
        getFieldDecorator(name, object) {
          return (component) => {
            return component;
          };
        }
      }
    });

    expirationStep.find(Form).simulate('submit');
    expect(updateDeploymentStateSpy).to.have.property('callCount', 1);
    expect(onNextClickedSpy).to.have.property('callCount', 1);
  });

  it('should not updateDeploymentState on error in form', () => {
    expirationStep.setProps({
      expirationTimeStamp: 1234567,
      form: {
        validateFields(cb) {
          cb(new Error('Test field fails'));
        },
        getFieldDecorator(name, object) {
          return (component) => {
            return component;
          };
        }
      }
    });

    expirationStep.find(Form).simulate('submit');
    expect(updateDeploymentStateSpy).to.have.property('callCount', 0);
    expect(onNextClickedSpy).to.have.property('callCount', 0);
  });
});

describe('DataSourceStep', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DataSourceStep initialValues={{}} />, div);
  });
});

describe('DeployStep', () => {
  let deployContractSpy;
  let deployStep;
  
  beforeEach(() => {
    deployContractSpy = sinon.spy();
    deployStep = shallow(<DeployStep deployContract={deployContractSpy} />);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DeployStep deployContract={deployContractSpy} />, div);
  });

  it('should render Alert when error is set', () => {
    deployStep.setProps({ error: 'Error message', loading: false });
    expect(deployStep.find(Alert)).to.have.length(1);
  });

  it('should only render .result when contract is created', () => {
    deployStep.setProps({ error: null, loading: true, contract: null });
    expect(deployStep.find('.result')).to.have.length(0);
    deployStep.setProps({ error: null, loading: false, contract: {
      address: '0x00000'
    } });
    expect(deployStep.find('.result')).to.have.length(1);
  });
});
