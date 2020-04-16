/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import EditableTable from "../../components/EditableTable";
import {
  getBackOfficeSettings,
  updateBackOfficeSettings
} from "../../actions/settings-actions/actions";

const mapDispatchToProps = dispatch => {
  return {
    getSettings: () => dispatch(getBackOfficeSettings()),
    updateSettings: settings => dispatch(updateBackOfficeSettings(settings))
  };
};

const mapStateToProps = state => {
  return {
    settings: state.settingsReducer
  };
};

const getColumns = settings => {
  if (settings == null) return [];
  return Object.keys(settings).map(key => {
    return {
      title: key,
      dataIndex: key,
      width: `${(1 / (Object.keys(settings).length + 1)) * 100}%`,
      editable: true
    };
  });
};

const Settings = ({ settings = {}, getSettings, updateSettings }) => {
  useEffect(() => {
    getSettings();
  }, []);
  const editSettings = (settingsIn, key) => {
    const newSettings = {
      ...settings,
      [key]: settingsIn
    };
    updateSettings(newSettings);
  };
  return (
    <div>
      <EditableTable
        settings={
          settings.emailSettings == null
            ? []
            : [{ ...settings.emailSettings, key: settings.id }]
        }
        updateSettings={editSettings}
        columns={getColumns(settings.emailSettings)}
        settingsKey="emailSettings"
      />
      <EditableTable
        settings={
          settings.reservationSettings == null
            ? []
            : [{ ...settings.reservationSettings, key: settings.id }]
        }
        updateSettings={editSettings}
        columns={getColumns(settings.reservationSettings)}
        settingsKey="reservationSettings"
      />
      <EditableTable
        settings={
          settings.calendarSettings == null
            ? []
            : [{ ...settings.calendarSettings, key: settings.id }]
        }
        updateSettings={editSettings}
        columns={getColumns(settings.calendarSettings)}
        settingsKey="calendarSettings"
      />
    </div>
  );
};

const connectedSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export default connectedSettings;
