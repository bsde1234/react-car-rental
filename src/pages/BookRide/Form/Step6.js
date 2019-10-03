import React, { Component } from "react";
import { withFirebase } from "../../../components/Firebase";
import Driver from "../../../components/Driver";

class Step6 extends Component {
  state = { drivers: null, selectedDriver: null, loading: true };

  componentDidMount() {
    const { firebase } = this.props;
    firebase.auth.currentUser &&
      firebase.drivers().on("value", snapshot => {
        const driversObject = snapshot.val();
        if (driversObject) {
          const driversList = Object.keys(driversObject).map(key => ({
            ...driversObject[key],
            uid: key
          }));
          this.setState({
            drivers: driversList.filter(d => d.isAvailable),
            selectedDriver: this.props.selectedDriver,
            loading: false
          });
        } else {
          this.setState({ drivers: null, loading: false });
        }
      });
  }

  selectDriver = uid => {
    this.setState({ selectedDriver: uid });
    this.props.editState("driverId", uid);
  };

  render() {
    const { currentStep } = this.props;
    const { loading, drivers, selectedDriver } = this.state;

    if (currentStep !== 6) {
      // Prop: The current step
      return null;
    }

    return !loading ? (
      <div className="self-start text-left">
        <h1 className="text-xl font-semibold text-primary mt-8">
          Select Driver
        </h1>
        <p className="mb-8">
          If you don't need a driver, simply skip this step.
        </p>
        <div className="grid grid-col-2 grid-gap md:grid-col-4">
          {drivers.map(driver => (
            <Driver
              key={driver.uid}
              {...driver}
              selectDriver={this.selectDriver}
              selected={selectedDriver === driver.uid}
            />
          ))}
        </div>
      </div>
    ) : (
      <div uk-spinner=""></div>
    );
  }
}

export default withFirebase(Step6);
