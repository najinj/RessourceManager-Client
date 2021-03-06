/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Typography } from "antd";
import EditableTable from "../../components/EditableTable";
import {
  getBackOfficeSettings,
  updateBackOfficeSettings
} from "../../actions/settings-actions/actions";

const { Title } = Typography;

const mapDispatchToProps = dispatch => {
  return {
    getSettings: () => dispatch(getBackOfficeSettings()),
    updateSettings: settings => dispatch(updateBackOfficeSettings(settings))
  };
};

const mapStateToProps = state => {
  return {
    settingsViewModel: state.settingsReducer.settingsViewModel,
    settingsModel: state.settingsReducer.settingsModel
  };
};

const getColumns = settings => {
  if (settings == null) return [];
  return settings.map(setting => {
    return {
      title: setting.label,
      dataIndex: setting.name,
      inputType: setting.type,
      value: setting.value,
      selectOptions: setting.type === "Select" ? setting.options : null,
      width: `${(1 / (settings.length + 1)) * 100}%`,
      editable: true
    };
  });
};

const Settings = ({
  settingsViewModel = {},
  getSettings,
  updateSettings,
  settingsModel = {}
}) => {
  useEffect(() => {
    getSettings();
  }, []);
  const editSettings = (settingsIn, key) => {
    const newSettings = {
      ...settingsModel,
      [key]: settingsIn
    };
    updateSettings(newSettings);
  };
  const getSettingsForProps = settingsIn => {
    if (settingsIn == null) return [];
    const mySettings = [...settingsIn];
    mySettings.push({
      value: settingsViewModel.id,
      name: "key"
    });
    return mySettings;
  };
  return (
    <div>
      <div>
        <Title level={4}>Email Settings</Title>
        <EditableTable
          settings={getSettingsForProps(settingsViewModel.emailSettings)}
          updateSettings={editSettings}
          columns={getColumns(settingsViewModel.emailSettings)}
          settingsKey="emailSettings"
        />
      </div>
      <div>
        <Title level={4}>Reservation Settings</Title>
        <EditableTable
          settings={getSettingsForProps(settingsViewModel.reservationSettings)}
          updateSettings={editSettings}
          columns={getColumns(settingsViewModel.reservationSettings)}
          settingsKey="reservationSettings"
        />
      </div>

      <div>
        <Title level={4}>Calendar Settings</Title>
        <EditableTable
          settings={getSettingsForProps(settingsViewModel.calendarSettings)}
          updateSettings={editSettings}
          columns={getColumns(settingsViewModel.calendarSettings)}
          settingsKey="calendarSettings"
        />
      </div>
    </div>
  );
};

const connectedSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

export default connectedSettings;
