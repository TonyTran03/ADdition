using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BlendConstraint : MonoBehaviour
{
    public bool Active = false;
    public string CorrectTag;
    public string InvalidTag;

    public GameObject o;
    float _r = 0.5f;
    private void OnTriggerStay(Collider other)
    {
       // print(other.tag.Contains(CorrectTag));
        Active = ((other.tag.Contains(CorrectTag) || CorrectTag.Length <= 0)) && (!other.tag.Contains(InvalidTag) || InvalidTag.Length <= 0);

        o = other.gameObject;
    }

    private void Update()
    {
        if (_r <= 0) {
            Active = false;
            _r = 0.5f;
        }

        _r -= Time.deltaTime;
    }
}
